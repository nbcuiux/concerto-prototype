


import DelayChain from "./DelayChain"

function hasClass(el, className) {
  if (el.classList)
    return el.classList.contains(className)
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

function addClass(el, className) {
  if (el.classList)
    el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}

function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className)
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
}



function add(el, className, duration) {

	let dc = new DelayChain;
	let addingClassName = className + "-adding";
	let removingClassName = className + "-removing";

	dc.delay(1, ()=>{
		addClass(el, addingClassName);
	}).delay(1, ()=>{
		addClass(el, className);
	}).delay(duration, ()=>{
		removeClass(el, addingClassName);
	});
}

function remove(el, className, duration) {
	
	let dc = new DelayChain;
	let addingClassName = className + "-adding";
	let removingClassName = className + "-removing";

	dc.delay(1, ()=>{
		addClass(el, removingClassName);
	}).delay(1, ()=>{
		removeClass(el, className);
	}).delay(duration, ()=>{
		removeClass(el, removingClassName);
	});
}










const TransitionClass = {
	add: add,
	remove: remove
}

export default TransitionClass