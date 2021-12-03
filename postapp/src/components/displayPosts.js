import React, { Component } from "react";
import { listPosts } from "../graphql/queries";
import { API, graphqlOperation } from 'aws-amplify';
import DeletePost from "./deletePost";
import EditPost from "./editPost";
import {onCreatePost, onDeletePost} from '../graphql/subscriptions'

class DisplayPosts extends Component{
    state={
        posts:[]
    };

    componentDidMount = async()=>{
        this.getPosts();
        this.createPostListener=API.graphql(graphqlOperation(onCreatePost))
        .subscribe({
            next: postData=>{
                const newPost=postData.value.data.onCreatePost;
                const prevPosts=this.state.posts.filter(post=> post.id !== newPost.id);
                const updatedPosts = [newPost, ...prevPosts];
                this.setState({posts:updatedPosts});
            }
        });
        this.deletePostListener=API.graphql(graphqlOperation(onDeletePost))
        .subscribe({
            next:postData=>{
                const deletedPost=postData.value.data.onDeletePost;
                const updatePosts=this.state.posts.filter(post=>post.id!==deletedPost.id);
                this.setState({posts:updatePosts});
            }
        })
    }

    componentWillUnmount = async ()=>{
        this.createPostListener.unsubscribe();
        this.deletePostListener.unsubscribe();
    }

    getPosts = async ()=>{
        const result = await API.graphql(graphqlOperation(listPosts));
        //console.log("All results:"+JSON.stringify( result.data.listPosts ));
        //console.log("All results items:"+JSON.stringify( result.data.listPosts.items ));
        this.setState({posts:result.data.listPosts.items});
    };

    render() {
        const {posts}=this.state;
        //console.log("State items:"+posts);
        return posts.map((post)=>{
            return (
                <div className="posts" style={rowstyle} key={post.id}>
                <h1>{post.postTitle}</h1>
                <span style={{fontStyle:"italic",color:"#0ca597"}}>Wrote by {post.postOwnerUsername}
                {' on '}
                <time style={{fontStyle:"italic"}}>
                    {new Date(post.createdAt).toDateString()}
                </time>
                </span>
                <p>{post.postBody}</p>
                <span style={{display:"inline"}}>
                    <DeletePost data={post} /><EditPost {...post} />
                </span>
                </div>
                
            );
        });
    }
}

const rowstyle = {
    background:'#f4f4f4',
    padding:'10px',
    border:'1px #ccc dotted',
    margin:'14px',

}
export default DisplayPosts;