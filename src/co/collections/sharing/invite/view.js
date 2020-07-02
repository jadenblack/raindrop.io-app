import React from 'react'
import t from '~t'

import { Alert } from '~co/overlay/dialog'
import { Layout, Label, Text, Radio } from '~co/common/form'
import Button from '~co/common/button'
import Icon from '~co/common/icon'

export default class CollectionSharingInviteView extends React.PureComponent {
    state = {
        show: false,
        emails: '',
        role: 'member'
    }

    componentDidUpdate(prev) {
		if (prev.status != this.props.status)
			switch(this.props.status) {
                case 'error':
					Alert(t.s('sendInvites')+' '+t.s('server').toLowerCase())
                break
                
				case 'done':
					this.setState({ emails: '' })
					Alert(t.s('invitesSendTo')+' '+this.props.sendTo.join(', '))
				break
			}
    }
    
    onShowClick = ()=>
        this.setState({ show: true })

    handleEmailsChange = (e)=>
        this.setState({ emails: e.target.value })

    handleChangeRole = (e)=>
        this.setState({ role: e.currentTarget.value })

    onSubmit = e=>{
        e.preventDefault()

        if (!this.state.emails)
            return
            
        this.props.onInvite(this.state.emails.split(/,|\s/), this.state.role)
    }

    render() {
        const { emails, role, show } = this.state
        const { status, access } = this.props

        const loading = status == 'loading'

        if (access.level < 3)
            return null

        if (!show)
            return (
                <Layout>
                    <Button variant='outline' data-block onClick={this.onShowClick}>
                        <Icon name='add' />
                        {t.s('inviteMorePeople')}
                    </Button>
                </Layout>
            )

        return (
            <form onSubmit={this.onSubmit}>
                <Layout>
                    <Label>{t.s('inviteMorePeople')}</Label>
        
                    <Text
                        placeholder={t.s('enterEmails')}
                        disabled={loading}
                        value={emails}
                        required
                        autoSize
                        multiline
                        autoFocus
                        onChange={this.handleEmailsChange} />

                    <Label>{t.s('withAccessLevel')}</Label>

                    <div>
                        <Radio 
                            checked={role=='member'}
                            value='member'
                            disabled={loading}
                            onChange={this.handleChangeRole}>
                            {t.s('role_members')+' '+t.s('und')+' '+t.s('inviteMorePeople').toLowerCase()}
                        </Radio>

                        <Radio 
                            checked={role=='viewer'}
                            value='viewer'
                            disabled={loading}
                            onChange={this.handleChangeRole}>
                            {t.s('role_viewer')}
                        </Radio>
                    </div>

                    <Button 
                        Tag='input'
                        type='submit'
                        variant='primary'
                        disabled={loading}
                        value={t.s('sendInvites')+(loading ? '…' : '')} />
                </Layout>
            </form>
        )
    }
}