import React, { useState, Fragment } from 'react';
import addToMailchimp from 'gatsby-plugin-mailchimp';
import './EmailSignup.scss';

const isValidEmail = (value) => /^.+@.+\..+$/.test(value);

const CampaignMessage = () => (
  <Fragment>
    <h1>Join the Newsletter</h1>
    <p>
      Educational and motivational web developer content
      <br />
      delivered to your inbox.
    </p>
  </Fragment>
);

const ThanksMessage = () => (
  <Fragment>
    <h2>Thanks for subscribing!</h2>
    <img src="/media/open-email-icon.png" />
    <p>Hope to be in touch soon.</p>
  </Fragment>
);
const EmailSignup = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState(!isValidEmail(email));

  return (
    <div id="mc_embed_signup">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);

          addToMailchimp(email).then(({ result, msg }) => {
            setSubmitting(false);
            setSuccess(true);
          });
        }}
      >
        <div id="mc_embed_signup_scroll">
          {success ? <ThanksMessage /> : <CampaignMessage />}
          {!success && (
            <Fragment>
              <div className="mc-field-group" />
              <div className="mc-field-group">
                <input
                  type="email"
                  defaultValue=""
                  name="EMAIL"
                  className="required email"
                  id="mce-EMAIL"
                  placeholder="Your email address"
                  onChange={(e) => {
                    const value = e.currentTarget.value.trim();

                    setEmail(value);
                    setValidationError(!isValidEmail(value));
                  }}
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

              <button type="submit" disabled={submitting || validationError}>
                {submitting ? 'Please wait...' : 'Subscribe'}
              </button>

              <p>No spam. Unsubscribe anytime.</p>
            </Fragment>
          )}
        </div>
      </form>
    </div>
  );
};

export default EmailSignup;
