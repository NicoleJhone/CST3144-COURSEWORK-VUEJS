var webstore = new Vue({
  el: "#app",
  data: {
    sitename: "After School Classes",
    subjects: [],
    showsubject: true,
    sortBy: "subject",
    ascending: true,
    searchValue: "",
    cart: [],
    order: {
      firstName: "",
      lastName: "",
      address: "",
      phoneNumber: "",
      lessonID: "",
    },
    searchValue: "",
  },
  created: function () {
    console.log("requesting data from server ...");

    fetch(
      "https://cst3144-coursework-express-js.onrender.com/collection/lessons"
    ).then(function (response) {
      response.json().then(function (json) {
        webstore.subjects = json;
        console.log(json);
      });
    });
  },
  methods: {
    // add to cart button
    addToCart(subject) {
      this.cart.push(subject);
    },
    //if condition for ATC button
    canAddToCart(subject) {
      return subject.availableSpace > this.cartCount(subject);
    },
    // checkout/lesson toggle
    showCart() {
      this.showsubject = !this.showsubject;
    },
    // cart length count
    cartCount(id) {
      let count = 0;
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i] === id) {
          count++;
        }
      }
      return count;
    },
    // remove subject from cart
    removeFromCart(index) {
      this.cart.splice(index, 1);
      if (this.cart.length === 0) {
        this.showsubject = true;
      }
    },
    // Validate name (letters only)
    validateName(name) {
      const nameRegex = /^[A-Za-z]+$/;
      return nameRegex.test(name);
    },
    // Validate phone number (numbers only)
    validatePhoneNumber(phoneNumber) {
      const phoneRegex = /^[0-9]+$/;
      return phoneRegex.test(phoneNumber);
    },
    // Check if the form is valid
    isFormValid() {
      return (
        this.validateName(this.order.firstName) &&
        this.validateName(this.order.lastName) &&
        this.validatePhoneNumber(this.order.phoneNumber)
      );
    },

    //checkout functionality
    saveOrder() {
      if (this.isFormValid()) {
          const newProduct = {
              firstName: this.order.firstName,
              lastName: this.order.lastName,
              phoneNumber: this.order.phoneNumber,
              lessonID: this.cart,
              space: this.cart.length,
          };
  
          console.log("Submitting order:", newProduct);
  
          fetch("https://cst3144-coursework-express-js.onrender.com/collection/orders", {
              method: "POST", // set the HTTP method as 'POST'
              headers: {
                  "Content-Type": "application/json", // set the data type as JSON
              },
              body: JSON.stringify(newProduct), // need to stringify the JSON object
          })
          .then((response) => response.json())
          .then((responseJSON) => {
              console.log("Order response:", responseJSON);
  
              // Update available lesson space
              this.cart.forEach((item) => {
                  console.log("Updating lesson:", item._id);
                  fetch("https://cst3144-coursework-express-js.onrender.com/collection/lessons/" + item._id, {
                      method: "PUT", // set the HTTP method as 'PUT'
                      headers: {
                          "Content-Type": "application/json", // set the data type as JSON
                      },
                      body: JSON.stringify({
                          availableSpace: item.availableSpace - 1,
                      }), // Assuming you want to decrement the space by 1
                  })
                  .then((response) => response.json())
                  .then((responseJSON) => {
                      console.log("Lesson " + item.title + " updated:", responseJSON);
                  })
                  .catch((error) => {
                      console.error("Error updating lesson " + item._id + ":", error);
                  });
              });
  
              alert("Order has been submitted!");
              // Clear form fields
              this.order.firstName = "";
              this.order.lastName = "";
              this.order.phoneNumber = "";
              // Clear cart
              this.cart = [];
              if (this.cart.length === 0) {
                  this.showsubject = true;
              }
          })
          .catch((error) => {
              console.error("Error submitting order:", error);
          });
      } else {
          alert("Missing fields");
      }
  }
  
  },
  computed: {
    sortedSubjects() {
      let subjectsArray = this.subjects;

      //search filter
      if (this.searchValue != "" && this.searchValue) {
        subjectsArray = subjectsArray.filter((subject) => {
          return (
            subject.title
              .toUpperCase()
              .includes(this.searchValue.toUpperCase()) ||
            subject.location
              .toUpperCase()
              .includes(this.searchValue.toUpperCase()) ||
            subject.price
              .toString()
              .toLowerCase()
              .includes(this.searchValue.toLowerCase()) ||
            subject.availableSpace
              .toString()
              .toLowerCase()
              .includes(this.searchValue.toLowerCase())
          );
        });
      }

      // sort by subjects
      subjectsArray = subjectsArray.sort((a, b) => {
        if (this.sortBy == "subject") {
          let fa = a.title.toLowerCase(),
            fb = b.title.toLowerCase();
          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        } //sort by location
        else if (this.sortBy == "location") {
          let fa = a.location.toLowerCase(),
            fb = b.location.toLowerCase();
          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        } // sort by price
        else if (this.sortBy == "price") {
          if (a.price > b.price) return 1;
          if (a.price < b.price) return -1;
          return 0;
        } // sort by availability
        else if (this.sortBy == "availability") {
          if (a.availableSpace > b.availableSpace) return 1;
          if (a.availableSpace < b.availableSpace) return -1;
          return 0;
        }
      }); //sort to asc/desc
      if (!this.ascending) {
        subjectsArray.reverse();
      }
      return subjectsArray;
    },
    cartItemCount: function () {
      return this.cart.length;
    },
  },
});
