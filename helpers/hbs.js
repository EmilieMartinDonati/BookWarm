const hbs = require("hbs");

const session = require("express-session");


hbs.registerHelper("compare", function(lvalue, rvalue, options) {
    if (arguments.length < 3)
      throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
  
    var operator = options.hash.operator || "==";
  
    var operators = {
      "==": function(l, r) {
        return l == r;
      },
      "===": function(l, r) {
        return l === r;
      },
      "!=": function(l, r) {
        return l != r;
      },
      "<": function(l, r) {
        return l < r;
      },
      ">": function(l, r) {
        return l > r;
      },
      "<=": function(l, r) {
        return l <= r;
      },
      ">=": function(l, r) {
        return l >= r;
      },
      typeof: function(l, r) {
        return typeof l == r;
      }
    };
  
    if (!operators[operator])
      throw new Error(
        "Handlerbars Helper 'compare' doesn't know the operator " + operator
      );
  
    var result = operators[operator](lvalue, rvalue);
  
    if (result) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  hbs.registerHelper("mycompare", function(a, b) {
     return  a === b ? true: false;
  })


//   Handlebars.registerHelper('times', function(n, block) {
//     var accum = '';
//     for(var i = 0; i < n; ++i)
//         accum += block.fn(i);
//     return accum;
// });
  