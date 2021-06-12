export const selectors = {
    posts: '#posts',
    titleInput: '#title',
    bodyInput: '#body',
    idInput: '#id',
    postSubmit: '.post-submit',
    editCancel: '.edit-cancel',
    postsContainer: '.posts-container',
    formContainer: '.form-container'
}

//SHORTHAND FN FOR DOCUMENT.QUERYSELECTOR()
const qs = (selector) => {
    return document.querySelector(selector);
}
export const showPosts = function (posts) {
    let output = '';

    posts.forEach((post) => {
        output += `
            <div class="card mb-3">
                <div class="card-body">
                    <h4 class="card-title">${post.title}</h4>
                    <p class="card-text">${post.body}</p>
                    <a href="#" class="edit card-link" data-id="${post.id}"><i class="fa fa-pencil"></i></a>
                    <a href="#" class="delete card-link" data-id="${post.id}"><i class="fa fa-remove"></i></a>
                </div>
            </div>`
    });

    qs(selectors.posts).innerHTML = output;
}
export const showAlert = (message, className) => {
    clearAlerts();
    const div = document.createElement('div');
    div.className = className;
    div.appendChild(document.createTextNode(message));
    const container = qs(selectors.postsContainer);
    const posts = qs(selectors.posts);
    container.insertBefore(div, posts);
    setTimeout(() => {
        clearAlerts()
    }, 2000)

}
const clearAlerts = () => {
    let currentAlert = qs('.alert');
    if (currentAlert) {
        currentAlert.remove();
    }
}
export const clearInputs = () => {
    qs(selectors.titleInput).value = null;
    qs(selectors.bodyInput).value = null;
    qs(selectors.idInput).value = null;
}
export const populateForm = (data) => {
    qs(selectors.titleInput).value = data.title;
    qs(selectors.bodyInput).value = data.body;
    qs(selectors.idInput).value = data.id;
}
export let currentState = 'new';

export const changeState = (state) => {
    let cancelButton = document.createElement('button')
    cancelButton.className = 'edit-cancel btn btn-light btn-block';
    cancelButton.appendChild(document.createTextNode('Cancel'));
    let form = qs(selectors.formContainer);
    //NEW STATE
    if (state === 'new') {
        if(currentState === state) return;
        if (qs(selectors.editCancel)) {
            qs(selectors.editCancel).remove();
        }
        qs(selectors.postSubmit).textContent = "Post it"
        currentState = state
    }
    //EDIT STATE
    if (state === 'edit') {
        if(currentState === state) return;
        form.insertAdjacentElement('beforeend', cancelButton);
        qs(selectors.postSubmit).textContent = "Update Post"
        currentState = state;
    }
}