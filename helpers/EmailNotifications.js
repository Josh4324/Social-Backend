const mailer = require('../config/mailerConfig');
const template = require('./EmailTemplate');


class EmailNotifications {
    /**
     *
     * @param {object} req Request Object
     * @param {object} user User
     * @param {string} resetToken Reset Token
     * @returns {function} returns a function
     */
    static async sendPasswordResetMail(req, user, resetToken) {
      const dbMessage = await EmailNotification.findOne({ where: { type: 'resetPassword' }});
      const { message: resetMessage, image } = dbMessage;
      const subject = 'Password Recovery';
      const emailBody = `
        <h3 class="username">Hello ${user.firstName},</h3>
        <p class="message">
        ${resetMessage}
        </p>
        <a class="btn" href="http://${req.headers.host}/${resetToken}">
          Reset password
        </a>`;
      const content = template(subject, emailBody, image);
      mailer.sendMail(user.email, subject, content);
    }
  
    /**
     * @param {*} email
     * @param {*} link
     * @param {*} name
     * @returns {*} sends an email to a new user
     */
    static async signupEmail(email, link, name) {
      //const dbMessage = await EmailNotification.findOne({ where: { type: 'signup' }});
      //const { message: signupMessage, image } = dbMessage;
      const image = "";
      const title = 'Welcome to Node Auth';
      const body = 
      `<p>Dear ${name}</p>

      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
      <tr>
        <td>&nbsp;</td>
        <td class="container">
          <div class="content">

            <!-- START CENTERED WHITE CONTAINER -->
            <table role="presentation" class="main">

              <!-- START MAIN CONTENT AREA -->
              <tr>
                <td class="wrapper">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        Welcome to Node Auth! We are excited to have you! <br/><br/>
      
                        Node Auth will get you started quickly. <br/><br/>
                          
                        We know you can’t do this alone, that’s why we have created Node Auth to help you thrive <br/><br/>
                          
                        <p class="message">Click the link below to confirm your registration</p> <br>
                       
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                          <tbody>
                            <tr>
                              <td align="left">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                  <tbody>
                                    <tr>
                                      <td> <a href=${link} target="_blank">Confirm Email</a> </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            <!-- END MAIN CONTENT AREA -->
            </table>
            <!-- END CENTERED WHITE CONTAINER -->

            <!-- START FOOTER -->
            <div class="footer">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="content-block">
                    <span class="apple-link">Node Auth, Lagos, Nigeria</span>
                   <!--  <br> Don't like these emails? <a href="http://i.imgur.com/CScmqnj.gif">Unsubscribe</a>. -->
                  </td>
                </tr>
                <tr>
                  <td class="content-block powered-by">
                    Powered by <a href="#">Node Auth</a>.
                  </td>
                </tr>
              </table>
            </div>
            <!-- END FOOTER -->

          </div>
        </td>
        <td>&nbsp;</td>
      </tr>
    </table>
       
       `;
      const message = template(title, body, image);
      mailer.sendMail(email, title, message);
    }
  }
  
module.exports =  EmailNotifications;
  