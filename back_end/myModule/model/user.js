class User {
  constructor(
    id,
    username,
    password,
    firstName,
    lastName,
    email,
    address,
    role,
    phone
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    (this.email = email), atob;
    this.address = address;
    this.lastName = lastName;
    this.role = role;
    this.phone = phone;
  }

  get getID() {
    return this.id;
  }
}
