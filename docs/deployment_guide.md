## Requirements
Before you deploy, you must have following in place:
- AWS Account
- GitHub Account


The **Deploy to Amplify Console** button will take you to your AWS console to deploy the front-end solution. Make sure you are connecting to the same AWS Account you deployed the backend solutio.

<a href="https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/UBC-CIC/VaccineDistribution">
    <img src="https://oneclick.amplifyapp.com/button.svg" alt="Deploy to Amplify Console">
</a>


The follow screenshots shows how simple this step is:

![alt text](../images/Step1.jpg)


Make sure there is service role to deploy the backends resources
![alt text](../images/Step2.jpg)

Under Deploy app, click on Environment variables. Please add the following environment variables. The REACT_APP_SUPER_ADMIN_EMAIL correspond to the email that you will use as the super admin for the aplication. Once the applicatio is install don't forget to create a new user using the email provided in this field. The REACT_APP_MAP_NAME allows you to give a name to the application. 


After adding the environmental variables, click Save and deploy

![alt text](../images/Step3.png)

Wait until the Provision, Build, Deploy and Verify are all green

![alt text](../images/Step4.jpg)
