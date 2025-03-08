// STEP 1
console.log("IT'S ALIVE!");

// TODO: Add the $$ function here!
function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// STEP 2 (commented out)
/*
let navLinks = $$("nav a");
let currentLink = navLinks.find(a => a.host === location.host && a.pathname === location.pathname);
if (currentLink) {
  currentLink.classList.add("current");
}
*/

// STEP 3
// // step 3.1
// let pages = [
//   { url: ".", title: "Home" },
//   { url: "projects", title: "Projects" },
//   { url: "contact", title: "Contact" },
//   { url: "cv", title: "CV" },
//   { url: "https://github.com/hap196", title: "GitHub" },
// ];

// let nav = document.createElement("nav");
// document.body.prepend(nav);

// // step 3.2
// for (let p of pages) {
//   let url = p.url;
//   let title = p.title;

//   // Create and configure link
//   let a = document.createElement("a");
//   a.href = url;
//   a.textContent = title;

//   // Add current class if this is the current page
//   if (a.host === location.host && a.pathname === location.pathname) {
//     a.classList.add("current");
//   }

//   // Add target="_blank" for external links
//   if (a.host !== location.host) {
//     a.target = "_blank";
//   }

//   nav.append(a);
// }

// STEP 4
// step 4.1
// TODO: Inside your styles.css file, adjust your navigation menu colors! There is nothing to do in this file in this step.

// step 4.2
// document.body.insertAdjacentHTML(
//   "afterbegin",
//   `
// 	<label class="color-scheme">
// 		Theme:
// 		<select>
// 			<option value="light dark">Auto</option>
//             <option value="dark">Dark</option>
//             <option value="light">Light</option>
// 		</select>
// 	</label>`
// );

// step 4.3
// TODO: Inside your styles.css file, add styling to move the switcher with class .color-scheme to the top right corner. There is nothing to do in this file in this step

// step 4.4
let select = document.querySelector("select");

function setColorScheme(colorScheme) {
  document.documentElement.style.setProperty("color-scheme", colorScheme);
  select.value = colorScheme;
  localStorage.colorScheme = colorScheme;
}

select.addEventListener("input", function (event) {
  console.log("color scheme changed to", event.target.value);
  setColorScheme(event.target.value);
});

if ("colorScheme" in localStorage) {
  setColorScheme(localStorage.colorScheme);
}

// STEP 5 (OPTIONAL)
// Note: This is an optional part of the lab! If you want to do it, uncomment the lines below and fill in the TODOs. Otherwise, leave the lines commented out.

// TODO: Inside the /contact/index.html, remove the enctype and method attributes from the <form> element. Remove the "Email" label and input as well.

// TODO: uncomment below to select the form element!
// let form = document.querySelector("form");

// form?.addEventListener("TODO: FILL IN EVENT WE ARE WAITING FOR", function (event) {
//     event.preventDefault();
//     let data = new FormData(form);

// let url = form.action + "?";
// for (let [name, value] of data) {
//     url += (name + "=" + value + "&")
//     console.log(name, value);
// }

// TODO: open url here!
// })
