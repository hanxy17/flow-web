import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { reduxForm, formValueSelector } from 'redux-form'

import DocumentTitle from 'react-document-title'

import { Select, Option } from 'components/Form/reduxForm'
import Button from 'components/Button'

import RSA, { validate as rsaValidate } from './rsa'
import IOS, { validate as iosValidate } from './Ios'

import classes from './form.scss'

const types = {
  RSA: {
    component: RSA,
    validate: rsaValidate,
  },
  IOS: {
    component: IOS,
    validate: iosValidate,
  }
}

const enumTypes = Object.keys(types)

export function validate (values) {
  const { type } = values
  const { validate: v } = types[type] || { }
  return v ? v(values) : {}
}

export class CreateCredentialForm extends Component {
  static propTypes = {
    type: PropTypes.oneOf(enumTypes),
    invalid: PropTypes.bool,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  getChildComponent () {
    const { type } = this.props
    if (types[type]) {
      const { component: Child } = types[type] || {}
      if (Child) {
        return <Child />
      }
    }
  }

  render () {
    const { handleSubmit, invalid, submitting, i18n } = this.props
    return <DocumentTitle title='添加证书 · 控制台'>
      <form className={classes.form} onSubmit={handleSubmit}>
        <table>
          <thead>
            <tr>
              <th className={classes.name}>类型</th>
              <th>
                <Select name='type'>
                  {enumTypes.map((t) => <Option key={t} value={t}
                    title={i18n(`${t}.title`)} />)}
                </Select>
              </th>
            </tr>
          </thead>
          {this.getChildComponent()}
          <tfoot>
            <tr>
              <td>&nbsp;</td>
              <td>
                <Button className='btn-primary' type='submit'
                  disabled={invalid} loading={submitting}>
                  生成
                </Button>
              </td>
            </tr>
          </tfoot>
        </table>
      </form>
    </DocumentTitle>
  }
}

export const CreateCredentialReduxForm = reduxForm({
  validate,
  form: 'createCredentialForm',
  initialValues: {
    type: 'RSA',
  }
})(CreateCredentialForm)

const selector = formValueSelector('createCredentialForm')

function mapStateToProps (state, props) {
  return {
    type: selector(state, 'type')
  }
}

export default connect(mapStateToProps)(CreateCredentialReduxForm)
