var webstore = new Vue({
  el: "#app",
  data: {
    sitename: "After School Classes",
    subjects: subjects,
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
        this.validateName(this.order.firstName && this.order.lastName) &&
        this.validatePhoneNumber(this.order.phoneNumber)
      );
    },
    //checkout functionality
    saveOrder() {
      if (this.isFormValid() && this.order.address) {
        //clear form fields
        this.order.firstName = "";
        this.order.lastName = "";
        this.order.phoneNumber = "";
        this.order.address = "";
        //clear cart
        this.cart = [];
        if (this.cart.length === 0) {
          this.showsubject = true;
        }
        alert("Order has been submitted!");
      } else {
        alert("Missing fields");
      }
    },
  },
  computed: {
    sortedSubjects() {
      let subjectsArray = this.subjects;

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
