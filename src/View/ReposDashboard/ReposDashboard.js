import React, { Component } from 'react';
import { RepoListContext } from '../../Contexts/Context'
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import { Link, Redirect } from 'react-router'
import './ReposDashboard.css'

export default class ReposDashboard extends Component{
    constructor() {
        super()

        this.state = {
            currentRepo: 1,
            fetchingbranches: false,
            fetchContributors: false,
            contributors: [],
            branches: []
        }

        this.fetchContributors = this.fetchContributors.bind(this);
        this.fetchbranches = this.fetchbranches.bind(this);
    }

    fetchContributors() {
        this.setState({fetchingContributors: true });
        this.context.state.repoList.map((key, index) => {
            fetch(key.contributors_url)
            .then((res) => res.json())
            .then((json) => this.setState({contributors: [...this.state.contributors, json]}))
            .catch((err) => console.log(err))
        })
    }

    fetchbranches() {
        this.setState({fetchingbranches: true });
        this.context.state.repoList.map((key, index) => {
            key.branches_url = key.branches_url.slice(0, key.branches_url.length -9);
            fetch(key.branches_url)
            .then((res) => res.json())
            .then((json) => this.setState({branches: [...this.state.branches, json]}))
            .catch((err) => console.log(err))
        })
    }


    componentWillMount() {
        this.fetchContributors()
        this.fetchbranches()
        console.log(this.state)
    }

    render() {
        let repoList = this.context.state.repoList
        return (
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}
            >
                {this.context.state.repoList.length == 0 ? <Redirect to='/' /> : null}
                <Grid item xs={3}>
                    <h1 className="title">GitView</h1>
                </Grid>
                {repoList.map((key, index) => {
                return (
                <ExpansionPanel key={key.id} xs={6} sm={6} style={{minWidth:"75%", maxWidth: "75%"}}>
                    <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Avatar alt='Avatar' src={key.owner.avatar_url} style={{marginRight: '5vw'}}/> 
                    <Typography variant='h6'>{key.full_name}
                    <Typography variant='subtitle1' xs={10}>
                        {key.description}
                    </Typography>
                    <Typography variant='subtitle2' style={{paddingRight: "10px"}}>{key.stargazers_count}<StarBorderRoundedIcon color="primary" style={{display: "inline"}}/></Typography>
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    {
                        this.state.contributors[index] ?
                            this.state.contributors[index].map((key, index) => {
                                return (<Tooltip key={key.id} title={key.login}>
                                            <Avatar  alt='Avatar' size="small"src={key.avatar_url}/>
                                        </Tooltip>)
                            }) : null
                    }
                    <Divider variant="middle" orientation="vertical"/>
                    <div> {this.state.branches[index] ? `${this.state.branches[index].length} branch` : null}
                    {
                        this.state.branches[index] ?
                            this.state.branches[index].map((key, index) => {
                                return (<Typography key={key.nodes_id + '' + index} variant='subtitle2'>
                                            {key.name}
                                            
                                        </Typography>)
                            }) : null
                    }
                    </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                )
            })}
            </Grid>
        )
    }
}

ReposDashboard.contextType = RepoListContext;
