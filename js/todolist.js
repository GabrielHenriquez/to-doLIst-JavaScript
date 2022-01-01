//REFERÊNCIA DOS ELEMENTOS

document.onreadystatechange = () => {
    if(document.readyState == 'complete'){
        addTaskIntoDOM()
        addCheck()
    }
}

const input = document.getElementById('item-input')
const form = document.getElementById('todo-add')
const ul = document.getElementById('todo-list')
const small = document.getElementById('small')
const lis = ul.getElementsByTagName('li')

//'BANCO DE DADOS'

let dataBaseTasks = () => JSON.parse(localStorage.getItem('task')) || []

//FUNÇÕES

function generateLi(task) {
    const li = document.createElement('li')
    const p = document.createElement('p')
    const btn = document.createElement('button')
    const checkButton = document.createElement('i')
    const editButton = document.createElement('i')
    const deleteButton = document.createElement('i')
    const divEdit = document.createElement('div')
    const inputDivEdit = document.createElement('input')
    const buttonDivEdit = document.createElement('button')
    const buttonDivEdit2 = document.createElement('button')

    li.classList.add('todo-item')
    p.className = 'task-name'
    p.textContent = task.task
    btn.className = 'button-check'
    if (task.check == true) {
        checkButton.className = 'fas fa-check'
    } else {
       checkButton.className = 'fas fa-check displayNone' 
    }
    checkButton.id = 'btnCheck'
    editButton.className = 'fas fa-edit'
    divEdit.id = 'edit'
    divEdit.className = 'editContainer'
    inputDivEdit.className = 'editInput'
    inputDivEdit.id = 'input'
    buttonDivEdit.className = 'editButton'
    buttonDivEdit.id = 'editBtn'
    buttonDivEdit.textContent = 'Edit'
    buttonDivEdit2.textContent = 'Cancel'
    buttonDivEdit2.id = 'cancel'
    buttonDivEdit2.className = 'cancelButton'
    deleteButton.id = 'delButton'
    deleteButton.className = 'fas fa-trash-alt'

    ul.appendChild(li)
    li.appendChild(btn)
    li.appendChild(p)
    btn.setAttribute('data-action', 'checkButton')
    btn.appendChild(checkButton)
    editButton.setAttribute('data-action', 'editButton')
    li.appendChild(editButton)
    li.appendChild(divEdit)
    divEdit.appendChild(inputDivEdit)
    divEdit.appendChild(buttonDivEdit)
    divEdit.appendChild(buttonDivEdit2)
    deleteButton.setAttribute('data-action', 'deleteButton')
    li.appendChild(deleteButton)

    small.className = 'displayNone'
}

function addTaskIntoDOM() {
    ul.innerHTML = ''
    let tasks = dataBaseTasks()
    tasks.forEach(task => generateLi(task))
}

function addTaskIntoLocalStorage(task) {
    let tasks = dataBaseTasks()
    tasks.push({task, check:false})
    localStorage.setItem('task', JSON.stringify(tasks))
}

function clearInput() {
    input.value = ''
    input.focus()
}

const addCheck = () => {
    let checkbuttons = document.querySelectorAll('.button-check');
    let tasks = dataBaseTasks()
    checkbuttons.forEach((checkButton, index) => {
        checkButton.onclick = () => { 
            if (checkButton.children[0].classList.contains('displayNone')) { 
                checkValue(checkButton,true,tasks, index)
           } else {
            checkValue(checkButton,false,tasks, index)
           }  
       }
    }) 
}

function checkValue(element, state, arr, index) {
    element.children[0].classList.toggle('displayNone')
    arr[index].check = state 
    localStorage.clear()
    localStorage.setItem('task', JSON.stringify(arr))
}

// EVENT HANDLER

form.addEventListener('submit', element => {
    element.preventDefault()

    if (!input.value) {
        small.className = ''
        input.focus()
        return
    }

    addTaskIntoLocalStorage(input.value)
    addTaskIntoDOM()
    clearInput()
    addCheck()
})

ul.addEventListener('click', element => {
    const dataAction = element.target.getAttribute('data-action')

    if (!dataAction) return

    currentLi = element.target
    while (currentLi.nodeName != 'LI') {
        currentLi = currentLi.parentElement
    }

    currentLiIndex = [...lis].indexOf(currentLi)

    if (dataAction == 'editButton') {
        document.getElementById('edit').style.display = 'flex'
        let tasks = dataBaseTasks()
        let btnEdit = document.getElementById('editBtn')
        btnEdit.addEventListener('click', () => {
            let editText = document.getElementById('input').value
            if (!editText) {
                alert('preencha o campo para editar')
                return
            }
            tasks[currentLiIndex].task = editText  
            
            localStorage.clear()
            localStorage.setItem('task', JSON.stringify(tasks)) 
            addTaskIntoDOM()
            addCheck()
        })

        let btnCancel = document.getElementById('cancel')
        btnCancel.addEventListener('click', () =>
            document.getElementById('edit').style.display = 'none'
        )
    } 

    else if (dataAction == 'deleteButton') {
        let tasks = dataBaseTasks()
        tasks.splice(currentLiIndex, 1)
        localStorage.clear()
        localStorage.setItem('task', JSON.stringify(tasks))
        addTaskIntoDOM()
    }

})




