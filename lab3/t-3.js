DynamicHTMLTable = function (columns) {
    this.columns = columns
    this.records = 0;
    this.table = document.querySelector('table')

    this.check_index = function (index) {
        return index >= 1 && index <= this.records
    }

    this.append_row = function (record) {
        if (this.records === 0) {
            this._append_row(this.columns)
        }
        this._append_row(record)
        this.records++;
    }

    this._append_row = function (data) {
        let tr = document.createElement('tr')
        for (let i = 0; i < data.length; ++i) {
            const td = document.createElement('td')
            td.textContent = data[i]
            tr.appendChild(td)
        }
        this.table.appendChild(tr)
    }

    this.replace_row = function (index, record) {
        if ( !this.check_index(index) )
            return;
        const tr = this.table.querySelectorAll('tr')[index]
        const td = tr.querySelectorAll('td');
        for(let i = 0; i < td.length; ++i) {
            td[i].textContent = record[i]
        }
    }

    this.remove_row = function (index) {
        if ( !this.check_index(index) )
            return;
        this._remove_row(index);
        this.records--;
        if (this.records === 0) {
            this._remove_row(0);
        }
    }

    this._remove_row = function (index) {
        this.table.removeChild(this.table.querySelectorAll('tr')[index]);
    }
}

function main() {
    const columns = ['№', 'Предмет', 'Преподаватель', 'Кол-во часов', 'Оценка', 'Дата']
    let table = new DynamicHTMLTable(columns)
    let items_array = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : []

    const input_form = document.querySelector('form[id=input_form]')
    const input_form_items = input_form.querySelectorAll('input[type=text]')
    input_form.addEventListener('submit', function (e) {
        e.preventDefault()
        let record = []
        for(let i = 0; i < input_form_items.length; ++i) {
            record.push(input_form_items[i].value)
        }
        table.append_row(record)
        items_array.push(record)
        localStorage.setItem('items', JSON.stringify(items_array))
        for(let i = 0; i < input_form_items.length; ++i) {
            input_form_items[i].value = ''
        }
    })

    const remove_form = document.querySelector('form[id=remove_form]')
    const remove_form_item = remove_form.querySelector('input[id=remove_row_number]')
    remove_form.addEventListener('submit', function(e) {
        e.preventDefault()
        let row_number = Number(remove_form_item.value)
        remove_form_item.value = ''
        if (row_number < 1 || row_number > items_array.length)
            return;
        items_array.splice(row_number - 1, 1)
        localStorage.setItem('items', JSON.stringify(items_array))
        table.remove_row(row_number)
    })

    const edit_form = document.querySelector('form[id=edit_form]')
    const edit_form_items = edit_form.querySelectorAll('input[class=edit_item]')
    const edit_row_number = edit_form.querySelector('input[id=edit_row_number]')
    const edit_load_btn = edit_form.querySelector('input[id=load_button]')
    let edit_for_is_locked = true
    let last_num = -1
    edit_load_btn.onclick = function () {
        edit_for_is_locked = false
        let row_number = Number(edit_row_number.value)
        last_num = row_number
        if (row_number < 1 || row_number > items_array.length)
            return;
        for(let i = 0; i < edit_form_items.length; ++i) {
            edit_form_items[i].value = items_array[row_number - 1][i]
            edit_form_items[i].readOnly = false;
        }
    }
    edit_form.addEventListener('submit', function (e) {
        e.preventDefault()
        if (edit_for_is_locked)
            return
        let new_record = []
        for(let i = 0; i < edit_form_items.length; ++i) {
            new_record.push(edit_form_items[i].value)
            edit_form_items[i].value = ''
            edit_form_items[i].readOnly = true;
        }
        items_array[last_num] = new_record
        localStorage.setItem('items', JSON.stringify(items_array))
        table.replace_row(last_num, new_record)
        edit_for_is_locked = false
    })


    for (let i = 0; i < columns.length; ++i) {
        input_form_items[i].setAttribute('placeholder', columns[i])
        edit_form_items[i].setAttribute('placeholder', columns[i])
    }

    items_array.forEach(function (item) {
        table.append_row(item)
    })
}

main()
