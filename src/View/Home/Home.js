import React, { Component } from 'react';
import "./Home.css"
import { Input } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Checkbox } from '@material-ui/core';
import { Link } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

export default class Home extends Component{
    constructor()
    {
        super();
        this.state = {
            reposFromAPI: {},
            repoList: [],
            repoListOpen: false,
            wordList: [],
            typing: false,
            page: 1,
            pageLimit: 15,
            typingTimeout: 0,
            fetchingAPI: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.fetchGithubApi  = this.fetchGithubApi.bind(this);
        this.handleCheckbox  = this.handleCheckbox.bind(this);
        this.listenToScroll  = this.listenToScroll.bind(this);
        this.handleLinkClick  = this.handleLinkClick.bind(this);
        this.handleReposButton  = this.handleReposButton.bind(this);
    }

    fetchGithubApi() {
        if (!this.state.wordList)
            return;
        this.setState({fetchingAPI: true });
        fetch('https://api.github.com/search/repositories?q=' + this.state.wordList.join('+')
        + '&page=' + this.state.page + '&per_page=' + this.state.pageLimit)
            .then((res) => res.json())
            .then((json) => this.setState({reposFromAPI: json, fetchingAPI: false}))
            .catch((err) => console.log(err))
    }

    // Handle query to the api when user has stop typing
    handleChange(event) {
        if (this.state.typingTimeout) {
           clearTimeout(this.state.typingTimeout);
        }
    
        if (!event.target.value)
            return ;
        this.setState({
           wordList: event.target.value.split(" "),
           reposFromAPI: {},
           typing: false,
           typingTimeout: setTimeout(() =>{
               this.fetchGithubApi()
             }, 500)
        });
    }

    // Scroll Event for infinite scroll loading
    listenToScroll() {
        const winScroll =
          document.body.scrollTop || document.documentElement.scrollTop
      
        const height =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight
      
        const scrolled = winScroll / height
        if (scrolled == 1)
        {
            this.setState({pageLimit: this.state.pageLimit += 5})
            this.fetchGithubApi()
        }
    }

    // Handle checkBox list change (adding/deleting items from repoList)
    handleCheckbox(e, objArray, i) {
        if (e.target.checked)
        {
            let newRepoList = this.state.repoList
            newRepoList.push(objArray[i])
            this.setState({repoList: newRepoList})
        }
        else
        {
            for(let i = 0; i < this.state.repoList.length ; i++)
            {
                if (this.state.repoList[i].id == e.target.value)
                {
                    let newRepoList = this.state.repoList;
                    if (this.state.repoList.length == 0 || i == 0)
                        newRepoList.splice(0,1)
                    else
                        newRepoList.splice(i,i)
                    this.setState({repoList: newRepoList})
                    
                }
            }
        }
        if (this.state.repoList.length == 0)
            this.setState({repoListOpen: false})
    }

    // True if ObjArray[i] is already in this.state.repoList
    isInRepoList(ObjArrayId) {
        for(let i = 0; i < this.state.repoList.length; i++)
        {
            if (ObjArrayId == this.state.repoList[i].id)
                return true;
        }
        return false;
    }

    // Handle Repos button click action
    handleReposButton(event) {
        this.setState({repoListOpen: !this.state.repoListOpen})
    }

    // Handle the display of error message for the user if he click on send without any repos selected
    handleLinkClick(event) {
        if (this.state.linkErrorTimeout) {
            clearTimeout(this.state.linkErrorTimeout);
        }

        if (this.state.repoList == 0)
        {
            event.preventDefault()
            this.setState({
                linkDisabled: true,
                linkErrorTimeout: setTimeout(() => {this.setState({
                    linkDisabled: false
                })}, 5000)
            })
        }
        else
        {
            this.setState({
                linkDisabled: false
            })
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', this.listenToScroll)
    }
      
    componentWillUnmount() {
        window.removeEventListener('scroll', this.listenToScroll)
    }

    render() {
        return (
            <div>
            <Grid container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
            style={{ minHeight: '100vh' }}>
            <Grid item xs={3}>
                <h1 className="title">GitView</h1>
                <Grid container justify = "center">
                    <Input autoFocus={true} placeholder="Repository to search" onChange={this.handleChange}/>
                    <Link to="/reposdashboard" onClick={this.handleLinkClick} style={{textDecoration: 'none'}}>
                        <Button variant="outlined" disabled={this.state.repoList.length == 0 ? true : false} color="primary">
                            Send
                        </Button>
                    </Link>
                    <Button variant={this.state.repoListOpen ? "contained" : "outlined"}
                    disabled={this.state.repoList.length == 0 ? true : false} color="secondary" onClick={this.handleReposButton}>
                            Repos({this.state.repoList.length})
                    </Button>
                </Grid>
                <List dense className="listRepos">
                {
                this.state.repoListOpen ? this.state.repoList.map((key, index) => {
                    return (
                        <ListItem  className="checkboxDiv" key={key.id + key}>
                            <ListItemAvatar>
                                <Avatar
                                    alt="Avatar"
                                    src={key.owner.avatar_url}
                                />
                            </ListItemAvatar>
                            <ListItemText primary={key.name} secondary={key.description} />
                            <ListItemSecondaryAction>
                                <Checkbox
                                checked={this.isInRepoList(key.id)}
                                value={key.id}
                                color="secondary"
                                inputProps={{ 'aria-label': 'Checkbox A' }}
                                onChange={(e) => {this.handleCheckbox(e, this.state.repoList, key)}}
                                />
                            </ListItemSecondaryAction>
                        </ListItem >)
                }) :
                Object.keys(this.state.reposFromAPI).map((key, index) => {
                    let objArray = this.state.reposFromAPI[key];
                    let tabRet = [];
                    for (let i = 0; i < objArray.length; i++) {
                        console.log(objArray[i])
                        tabRet.push(
                        <ListItem  className="checkboxDiv" key={objArray[i].id + key}>
                            <ListItemAvatar>
                                <Avatar
                                    alt="Avatar"
                                    src={objArray[i].owner.avatar_url}
                                />
                            </ListItemAvatar>
                            <ListItemText primary={objArray[i].name} secondary={objArray[i].description}/>
                            <ListItemSecondaryAction>
                                <Checkbox
                                edge="end"
                                checked={this.isInRepoList(objArray[i].id)}
                                value={objArray[i].id}
                                color="primary"
                                inputProps={{ 'aria-label': 'Checkbox A' }}
                                onChange={(e) => {this.handleCheckbox(e, objArray, i)}}
                                />
                            </ListItemSecondaryAction>
                        </ListItem >)}
                        
                    return tabRet;
                })}
                </List>
                </Grid>
                <br/>
                {this.state.linkDisabled ? <p className="errorMessage">You need to select at least one repository to send to the dashboard</p> : null}
                {this.state.fetchingAPI ? <div className="loadingAnim"><div></div><div></div><div></div></div> : null}
                </Grid>
            </div>
        )
    }

}
