# Kotodom Voice

## What is it?

A Telegram bot that listens to text messages, transcribes the text to speech using Amazon Polly voice service, and sends the audio back.

## Usage

#### 1. Create _.env_ file using .env.example as a template

env vars description:

`TELEGRAM_TOKEN` - tg token

`AWS_KEY` - aws key

`AWS_SECRET` - aws secret

`AWS_LANGUAGE_CODE` - language code, for example ru-RU

`AWS_VOICE_ID` - voice Id from here: https://docs.aws.amazon.com/polly/latest/dg/available-voices.html, for example Maxim

#### 2. Install dependencies:

`npm i`

#### 3. Start bot:

`npm start`
