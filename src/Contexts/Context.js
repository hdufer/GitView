import React, { Component } from 'react';
import {test} from './test';

export const RepoListContext = React.createContext();

export default class RepoListProvider extends Component {
    state = {
        test: 42,
        repoList: [],
        updateRepoList: (newRepoList) => this.setState({repoList: newRepoList})
    }

    render() {
        return(
            <RepoListContext.Provider value={{ state: this.state}}>
                {this.props.children}
            </RepoListContext.Provider>
        )
    }
}