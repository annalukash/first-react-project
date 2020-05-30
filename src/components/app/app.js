import React, {Component} from 'react';
import nextId from "react-id-generator";

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import PostStatusFilter from '../post-status-filter';
import PostList from '../post-list';
import PostAddForm from '../post-add-form';

import './app.css';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                {label: "Going to learn React", important: false, like: false, id: nextId()},
                {label: "That is so good", important: false, like: false, id: nextId()},
                {label: "Люблю котика-муркотика", important: false, like: false, id: nextId()}
            ],
            term: '',
            filter: 'all'
        };
        this.deleteItem = this.deleteItem.bind(this);
        this.addItem = this.addItem.bind(this);
        this.onToogleImportant = this.onToogleImportant.bind(this);
        this.onToogleLiked = this.onToogleLiked.bind(this);
        this.onUpdateSearch = this.onUpdateSearch.bind(this);
        this.onFilterSelect = this.onFilterSelect.bind(this);
    }

    deleteItem(id) {
        this.setState(({data}) => {
            const index = data.findIndex(elem => elem.id === id);

            const newArray = [...data.slice(0, index), ...data.slice(index + 1)];

            return {
                data: newArray
            }
        });
    }

    addItem(body) {
        const newItem = {
            label: body,
            important: false,
            id: nextId()
        }
        if (!newItem.label ) {
            return
        }
        this.setState(({data}) => {
            const newArray = [...data, newItem];
            return {
                data: newArray
            }
        })
    }

    onToogle(key, id) {
        this.setState(({data}) => {
            const index = data.findIndex((elem) => elem.id === id);

            const old = data[index];
            const newItem = {...old, [key]: !old[key]};

            const newArray = [...data.slice(0, index), newItem, ...data.slice(index + 1)];

            return {
                data: newArray
            }
        })
    }

    onToogleImportant(id) {
        this.onToogle('important', id);
    }

    onToogleLiked(id) {
        this.onToogle('like', id);
    }

    searchPost(items, term) {  
        if (!term.length) {
            return items
        } 
        
        return items.filter((item) => {
            return item.label.indexOf(term) > -1
        });
        
    }

    filterPost(items, filter) {
        if (filter === 'like') {
            return items.filter(item => item.like)
        } else {
            return items
        }
    }

    onUpdateSearch(term) {
        this.setState({term})
    }

    onFilterSelect(filter) {
        this.setState({filter})
    }

    render() {
        const {data, term, filter} = this.state;

        const liked = data.filter(item => item.like).length;
        const allPosts = data.length;

        const visiblePosts = this.filterPost(this.searchPost(data, term), filter);

        return (
            <div className="app">
            <AppHeader
                liked={liked}
                allPosts={allPosts}
            />
            <div className="search-panel d-flex">
                <SearchPanel
                    onUpdateSearch={this.onUpdateSearch}
                />
                <PostStatusFilter
                    filter={filter}
                    onFilterSelect={this.onFilterSelect}
                />
            </div>
            <PostList 
                posts={visiblePosts}
                onDelete={this.deleteItem}
                onToogleImportant={this.onToogleImportant}
                onToogleLiked={this.onToogleLiked}
            />
            <PostAddForm
                onAdd={this.addItem}
            />
        </div>
        );
    }
}