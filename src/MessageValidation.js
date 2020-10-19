//

module.exports = class Message {
  constructor({ text, author, email }) {
    this.text = text;
    this.email = email;
    this.author = author;
  }

  #isEmail(email) {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(emailRegEx)) return true;
    else return false;
  }

  #isEmpty(string) {
    if (!string || string?.trim() === "") {
      return true;
    } else return false;
  }

  validate() {
    let errors = {};

    // Email
    if (!this.#isEmail(this.email)) {
      errors.email = "Wrong e-mail format.";
    }
    if (this.#isEmpty(this.email)) {
      errors.email = "E-mail must be provided.";
    }

    // Text
    if (this.text.length < 100) {
      errors.text = "Message text must have 100 symbols at least.";
    }
    if (this.#isEmpty(this.text)) {
      errors.text = "Message text must be provided.";
    }

    // Author
    if (this.author.length < 4) {
      errors.author = "Author name must have 4 symbols at least.";
    }
    if (this.#isEmpty(this.author)) {
      errors.author = "Author name must be provided.";
    }
    return { valid: Object.keys(errors).length === 0, errors };
  }
};
