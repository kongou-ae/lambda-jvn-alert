# lambda-jvn-alert

A lambda function for sending a alert of JVN to Microsoft Teams by incoming webhook daily.

## usage

```
git clone https://github.com/kongou-ae/lambda-jvn-alert.git
cd lambda-jvn-alert
npm install
./node_modules/.bin/sls config credentials --provider aws --key YOUR-AWS-KEY --secret YOUR-AWS-SECRET --profile lambda
cp env.sample.yml env.yaml
vi env.yml
npm run build
npm run deploy
```