# pizza-delivery-api
This project is my second homework assignment for Pirple's mastering NodeJS course. The assignment focuses on building a restful API with raw NodeJS - no external libraries or frameworks.
This project therefore has no `package.json` file. In addition, we'll not be using an actual database but will instead use the filesystem class to implement a simple database.

## The Assignment
You are building the API for a pizza-delivery company. Don't worry about a frontend, just build the API. Here's the spec from your project manager: 

1. New users can be created, their information can be edited, and they can be deleted. We should store their name, email address, and street address.

2. Users can log in and log out by creating or destroying a token.

3. When a user is logged in, they should be able to GET all the possible menu items (these items can be hardcoded into the system). 

4. A logged-in user should be able to fill a shopping cart with menu items

5. A logged-in user should be able to create an order. You should integrate with the Sandbox of [Stripe](Stripe.com) to accept their payment. Note: Use the stripe sandbox for your testing. Follow this link and click on the "tokens" tab to see the fake tokens you can use server-side to confirm the integration is working: [Stripe Cards](https://stripe.com/docs/testing#cards)

6. When an order is placed, you should email the user a receipt. You should integrate with the sandbox of Mailgun.com for this. Note: Every Mailgun account comes with a sandbox email account domain (whatever@sandbox123.mailgun.org) that you can send from by default. So, there's no need to setup any DNS for your domain for this task [Mailgun Docs](https://documentation.mailgun.com/en/latest/faqs.html#how-do-i-pick-a-domain-name-for-my-mailgun-account)

This is an open-ended assignment. You may take any direction you'd like to go with it, as long as your project includes the requirements. It can include anything else you wish as well. 

## Project Update
1. Implemented file-system based database layer - [issue #8](https://github.com/biblicalph/pizza-delivery-api/issues/8). See [PR #21](https://github.com/biblicalph/pizza-delivery-api/pull/21) and [PR #22](https://github.com/biblicalph/pizza-delivery-api/pull/22). `PR #22` fixes a bug in `PR #21` for implementation notes or to check out the source code
2. Completed implementation of a [joi](https://github.com/hapijs/joi)-like validation module named `hop` (pronounced hope). `hop` currently supports string and number validation. Additional types can be added as needed. See tests in `lib/hop` for string and number implementations and usage. Example usage:
```javascript
'use strict'

const hop = require('./lib/hop')

const dataToValidate = ' something'
const schema = hop.string().trim().required().email()

const {error, value} = hop.validate(data, schema)
```

See [PR #25](https://github.com/biblicalph/pizza-delivery-api/issues/25) for implementation notes and source code
3. Implemented a module for creating errors for the application. [issue #26](https://github.com/biblicalph/pizza-delivery-api/issues/26) and [PR #27](https://github.com/biblicalph/pizza-delivery-api/pull/27). Usage
```javascript
'use strict' 

const { customError } = require('./lib/error')

const userNotFoundError = customError({ name: 'UserNotFoundError', message: 'User was not found' })

throw userNotFoundError
```
4. Update `hop` module to default to optional validation if required rule is not specified. See [issue #28](https://github.com/biblicalph/pizza-delivery-api/issues/28) and [PR #29](https://github.com/biblicalph/pizza-delivery-api/pull/29)
5. Implement user model. The `create` and `update` methods provide validation using `hop`. See [issue #9]((https://github.com/biblicalph/pizza-delivery-api/issues/9) and [PR #30](https://github.com/biblicalph/pizza-delivery-api/pull/30)

