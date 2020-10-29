const table = document.querySelector('table')
const insert_form = document.getElementById('insert_form')
const insert_form_inputs = insert_form.querySelectorAll('input[type=text]')
const delete_form = document.getElementById('remove_form')
const remove_form_input = delete_form.querySelector('input[type=text]')
const columns = ['person_id', 'name', 'second_name', 'surname', 'phone']

insert_form.addEventListener('submit', function (e) {
    e.preventDefault()
    let person = {}
    for (let i = 0; i < columns.length; ++i) {
        person[columns[i]] = insert_form_inputs[i].value
    }
    $.ajax({
        type: 'POST',
        url: 'insert_item',
        data: JSON.stringify(person),
        contentType: 'text/;charset=UTF-8',
        success: function () {
            console.log('SUCCESS')
        }
    })
    let new_row = table.insertRow(-1)
    for (let i = 0; i < columns.length; ++i) {
        let new_cell = new_row.insertCell(i)
        if (i === 0) {
            new_cell.classList.add('id_td')
        } else {
            new_cell.classList.add('field_td')
        }
        new_cell.innerText = insert_form_inputs[i].value
    }
})

delete_form.addEventListener('submit', function (e) {
    e.preventDefault()
    let row_number = Number(remove_form_input.value)
    if (row_number < 0 && row_number >= table.rows.length) {
        return
    }
    let person_id = table.rows[0].cells[0].innerText
    let request_data = {'person_id': person_id}
    $.ajax({
        type: 'POST',
        url: 'delete_item',
        data: JSON.stringify(request_data),
        contentType: 'text/;charset=UTF-8',
        success: function () {
            console.log('SUCCESS')
        }
    })
    table.deleteRow(row_number)
})

let editingTd;

table.onclick = function (event) {
    let target = event.target.closest('.edit-cancel,.edit-ok,td')
    if (!table.contains(target)) {
        return
    }
    if (target.className === 'edit-cancel') {
        finishTdEditing(editingTd.elem, false)
    } else if (target.className === 'edit-ok') {
        finishTdEditing(editingTd.elem, true)
    } else if (target.nodeName === 'TD' && target.cellIndex !== 0 && !editingTd) {
        makeTdEditable(target)
    }
}

function makeTdEditable(td) {
    editingTd = {
        elem: td,
        data: td.innerHTML
    }

    td.classList.add('edit-td')

    let textArea = document.createElement('textarea')
    textArea.style.width = (td.clientWidth-20) + 'px'
    textArea.style.height = (td.clientHeight-20) + 'px'
    textArea.className = 'edit-area'

    textArea.value = td.innerHTML
    td.innerHTML = ''
    td.appendChild(textArea)
    textArea.focus()

    td.insertAdjacentHTML("beforeEnd",
        '<div class="edit-controls"><button class="edit-ok">OK</button><button class="edit-cancel">CANCEL</button></div>'
    )
}

function finishTdEditing(td, isOk) {
    if (isOk) {
        let text = td.firstChild.value
        td.innerText = text
        let tr = td.parentNode
        let idx = td.cellIndex
        let request_data = {}
        request_data['person_id'] = tr.cells[0].innerText
        request_data[columns[idx]] = text
        $.ajax({
            type: 'POST',
            url: 'edit_item',
            data: JSON.stringify(request_data),
            contentType: 'text/;charset=UTF-8',
            success: function () {
                console.log('SUCCESS')
            }
        })
    } else {
        td.innerHTML = editingTd.data
    }
    td.classList.remove('edit-td')
    editingTd = null
}