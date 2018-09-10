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
