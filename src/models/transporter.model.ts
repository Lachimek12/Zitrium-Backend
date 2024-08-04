import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { MAILGUN_API_KEY } from '@utils/constants';
import { IMailgunClient } from 'mailgun.js/Interfaces';


const mailgun: Mailgun = new Mailgun(FormData);
export const transporter: IMailgunClient = mailgun.client({
  username: 'api',
  key: MAILGUN_API_KEY,
  //url: 'https://api.eu.mailgun.net', needed for eu based domain
});