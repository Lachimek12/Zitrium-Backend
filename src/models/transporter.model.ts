import nodemailer, { Transporter } from 'nodemailer';
import { EMAIL, EMAIL_SERVICE, PASSWORD } from '../utils/constants';

export const transporter: Transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  });