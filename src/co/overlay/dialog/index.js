import React from 'react'
import ViewAlert from './view/alert'
import ViewConfirm from './view/confirm'
import ViewPrompt from './view/prompt'

//Open alert
export async function Alert(message) {
    return DialogsContainer.openDialog('alert', { message })
}

//Open confirm
export async function Confirm(message) {
    return DialogsContainer.openDialog('confirm', { message })
}

//Open prompt
export async function Prompt(message, value='') {
    return DialogsContainer.openDialog('prompt', { message, value })
}

//Include this component anywhere in the app once!
export default class DialogsContainer extends React.Component {
    static openDialog = (type, detail)=>(
        new Promise(callback=>{
            const event = new CustomEvent('overlay-dialog', {
                detail: {
                    ...detail,
                    type,
                    callback
                }
            })
            window.dispatchEvent(event)
        })
    )

    state = {
        dialogs: []
    }

    componentDidMount() {
        window.addEventListener('overlay-dialog', this.addDialog)
    }

    componentWillUnmount() {
        window.removeEventListener('overlay-dialog', this.addDialog)
    }

    addDialog = ({ detail }) => {
        this.setState({
            dialogs: [
                ...this.state.dialogs,
                {
                    ...detail,
                    id: new Date().getTime()
                }
            ]
        })
    }

    sendResult = (id, result=false) => {
        const dialog = this.state.dialogs.find(dialog => dialog.id == id)
        if (!dialog) return

        dialog.callback(result)

        this.setState({
            dialogs: this.state.dialogs.filter(dialog => dialog.id != id)
        })
    }

    renderDialog = ({ type, id, ...detail }) => {
        let Component

        switch(type) {
            case 'alert': Component = ViewAlert; break
            case 'confirm': Component = ViewConfirm; break
            case 'prompt': Component = ViewPrompt; break
        }

        return (
            <Component 
                key={id}
                id={id}
                {...detail}
                sendResult={this.sendResult} />
        )
    }

    render() {
        const { dialogs } = this.state

        if (!dialogs.length) return null

        return dialogs.map(this.renderDialog)
    }
}