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
import './ReposDashboard.css'

export default class ReposDashboard extends Component{
    constructor() {
        super()

        this.state = {
            currentRepo: 1
        }
    }

    componentWillMount() {
        this.setState({
            repoList: this.context.state.repoList
        })
    }
    render() {
        console.log(this.context.state.repoList)
        return (
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}
            >
            <Grid item xs={3}>
                <h1 className="title">GitView</h1>
            </Grid>
            {this.state.repoList.map((key, index) => {
                return (
                <ExpansionPanel key={key.id} style={{maxWidth: '60vw', minWidth: '60vw'}}>
                    <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Avatar alt='Avatar' src={key.owner.avatar_url} style={{marginRight: '5vw'}}/> 
                    <Typography >{key.full_name}
                        <br />
                    </Typography>
                    <Typography variant='subtitle2' style={{paddingRight: "10px"}}>{key.stargazers_count}</Typography><StarBorderRoundedIcon/>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Typography variant='subtitle1' xs={10}>
                        {key.description}
                    </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                )
            })}
            </Grid>
        )
    }
}

ReposDashboard.contextType = RepoListContext;
