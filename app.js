import { http } from './modules/http.js';
import * as ui from './modules/ui.js'

//LOAD EVENT LISTENERS
const loadEventListeners = () => {
    document.querySelector(ui.selectors.formContainer).addEventListener('click', submitButtonHandler);
    document.querySelector(ui.selectors.posts).addEventListener('click', deletePost);
    document.querySelector(ui.selectors.posts).addEventListener('click', editPost);
    document.querySelector(ui.selectors.formContainer).addEventListener('keypress', keypressHandler);
}

const apiUrl = 'http://localhost:3000/posts'

const initialize = () => {
    ui.changeState('new');
    getPosts();
    loadEventListeners();
}
const submitButtonHandler = (e) => {
    if (!e.target.classList.contains('post-submit')) return;
    if (ui.currentState === 'new') {
        submitPost(e)
    }
    if (ui.currentState === 'edit') {
        updatePost(e)
    }
}
const keypressHandler = (e) => {
    if (e.key !== 'Enter') return;
    document.querySelector(ui.selectors.postSubmit).click();
    e.preventDefault();
}
const submitPost = (e) => {
    const title = document.querySelector(ui.selectors.titleInput).value;
    const body = document.querySelector(ui.selectors.bodyInput).value;
    const data = {
        title,
        body
    }
    if (data.title === '' || data.body === '') {
        ui.showAlert('Please fill in all fields', 'alert alert-warning')
        return;
    }
    http.post(apiUrl, data)
        .then((data) => {
            ui.showAlert('Post Added', 'alert alert-success');
            ui.clearInputs();
            getPosts(data);
        })
        .catch((err) => {
            console.error(err);
        })
}
const getPosts = () => {
    console.log('getting posts');
    http.get(apiUrl)
        .then(data => ui.showPosts(data))
        .catch(err => console.log(err))
}
const updatePost = (e) => {
    const title = document.querySelector(ui.selectors.titleInput).value;
    const body = document.querySelector(ui.selectors.bodyInput).value;
    const id = document.querySelector(ui.selectors.idInput).value;
    const data = {
        title,
        body
    }
    if (data.title === '' || data.body === '') {
        ui.showAlert('Please fill in all fields', 'alert alert-warning')
        return;
    }
    http.put(`${apiUrl}/${id}`, data)
        .then((data) => {
            ui.showAlert('Post Updated', 'alert alert-success');
            ui.clearInputs();
            ui.changeState('new')
            getPosts(data);
        })
        .catch((err) => {
            console.error(err);
        })
}
const deletePost = (e) => {
    e.preventDefault();
    let parent = e.target.parentElement
    if (!parent.classList.contains('delete')) return
    let id = parseInt(parent.dataset.id);
    http.delete(`${apiUrl}/${id}`)
        .then(() => {
            ui.showAlert('Post Deleted', 'alert alert-warning')
            getPosts()
        })
        .catch(err => console.error(err))
}
const editPost = (e) => {
    e.preventDefault();
    let parent = e.target.parentElement
    if (!parent.classList.contains('edit')) return
    let id = parseInt(parent.dataset.id);
    let post;
    http.get(`${apiUrl}/${id}`)
        .then((data) => {
            ui.populateForm(data);
            ui.changeState('edit');
        })
        .catch((err) => console.log(err));
}
//RUN APP
document.addEventListener('DOMContentLoaded', initialize());