import React from 'react';
import './EmailSignup.scss';

const EmailSignup = () => {
  return (
    <div id="mc_embed_signup">
      <form
        action="https://gmail.us3.list-manage.com/subscribe/post?u=370069ed4d26525b03f6aca88&amp;id=803d52114c"
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        className="validate"
        target="_blank"
        noValidate
      >
        <div id="mc_embed_signup_scroll">
          <h1>Join the Newsletter</h1>
          <p>
            Educational and motivational web developer content.
            <br />
            I'll email you whenever I post something.
          </p>
          <div className="mc-field-group">
            {/* <label htmlFor="mce-FNAME">First Name </label> */}
            <input
              type="text"
              defaultValue=""
              name="FNAME"
              className="required"
              id="mce-FNAME"
              placeholder="Your first name"
            />
          </div>
          <div className="mc-field-group">
            {/* <label htmlFor="mce-EMAIL">Email Address </label> */}
            <input
              type="email"
              defaultValue=""
              name="EMAIL"
              className="required email"
              id="mce-EMAIL"
              placeholder="Your email address"
            />
          </div>
          <div id="mce-responses" className="clear">
            <div
              className="response"
              id="mce-error-response"
              style={{ display: 'none' }}
            />
            <div
              className="response"
              id="mce-success-response"
              style={{ display: 'none' }}
            />
          </div>
          <div
            style={{ position: 'absolute', left: '-5000px' }}
            aria-hidden={true}
          >
            <input
              type="text"
              name="b_370069ed4d26525b03f6aca88_803d52114c"
              tabIndex={-1}
              defaultValue=""
            />
          </div>
          <div className="clear">
            <input
              type="submit"
              defaultValue="Subscribe"
              name="subscribe"
              id="mc-embedded-subscribe"
              className="button"
            />
          </div>
        </div>
      </form>
      <p>No spam. Unsubscribe anytime.</p>
    </div>
  );
};

export default EmailSignup;
