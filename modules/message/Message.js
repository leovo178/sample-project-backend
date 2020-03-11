class Message {
  /**
   *
   * @param {String} id
   */
  constructor(id) {
    this.attributes = {
      id,
      sender: null,
      receiver: null,
      content: null,
      lastModified: null,
    };
  }

  get sender() {
    return this.attributes.sender;
  }

  set sender(value) {
    this.attributes.sender = value;
  }

  get id() {
    return this.attributes.id;
  }

  get content() {
    return this.attributes.content;
  }

  set content(value) {
    this.attributes.content = value;
  }

  get lastModified() {
    return this.attributes.lastModified;
  }

  set lastModified(value) {
    this.attributes.lastModified = value;
  }

  toJson() {
    return this.attributes;
  }
}

module.exports = Message;