"use strict";

// ---------- 1 SELECTOR ----------

const boards = document.querySelectorAll(".board");
const boardOption = document.querySelector(".board-day-option");
const historyDates = document.querySelectorAll(".board-history-date");
const boardContainers = document.querySelectorAll(".board-container");

// ---------- 2 FUNCTION ----------

const dataJSON = function (format) {
	// ------ read JSON to update [board-time]
	fetch("data.json")
		.then((res) => res.json())
		.then((data) => {
			// work with JSON here

			boardContainers.forEach((el, i) => {
				// 1. Current
				el.querySelector(
					".board-hour"
				).textContent = `${data[i].timeframes[format].current}hrs`;
				// 2. Previous
				el.querySelector(
					".board-history-hour"
				).textContent = `${data[i].timeframes[format].previous}hrs`;
			});
		});
};

const hoverBoard = function (e) {
	// not trigger [hover effect] of parent when hover children
	// -.- Hard solution, add for All.boards to prevent [add.target] in the whole container each [mouseover]
	const iconHolder = this.querySelector(".board-control-icon-holder");
	const icon = this.querySelector(".board-control-icon");

	// -----------[1] enter board
	// add effect active-board
	this.classList.add("active-board");

	// add eventlistener [mouseenter] for children icon-holder

	// -----------[2] enter controlIcon
	iconHolder.addEventListener("mouseenter", (e) => {
		// remove active-board
		this.classList.remove("active-board");
		// add active-icon
		iconHolder.classList.add("active-control-icon-holder");
		icon.classList.add("active-control-icon");
	});

	// -----------[3] leave controlIcon, enter board
	iconHolder.addEventListener("mouseleave", (e) => {
		// remove active-board
		this.classList.add("active-board");
		// add active-icon
		iconHolder.classList.remove("active-control-icon-holder");
		icon.classList.remove("active-control-icon");
	});
};

// ---------- 3 INIT ----------
dataJSON("weekly");

// ---------- 4 EVENT HANDLER ----------
// [hover on board]
boards.forEach((el) => {
	el.addEventListener("mouseenter", hoverBoard);
	// [4] leave board
	el.addEventListener("mouseleave", () => {
		el.classList.remove("active-board");
	});
});

// [select option]
boardOption.addEventListener("click", function (e) {
	const options = [...this.children];
	if (!options.includes(e.target)) return;

	// reset + add [active-text]
	options.forEach((el) => el.classList.remove("active-text"));
	e.target.classList.add("active-text");

	// switch [format Date]
	const dateOption = e.target.textContent.toLowerCase();
	let newHistoryDate;
	switch (dateOption) {
		case "daily":
			newHistoryDate = "Yesterday";
			break;
		case "weekly":
		case "monthly":
			newHistoryDate = `Last ${e.target.textContent.slice(0, -2)}`;
			break;
	}
	historyDates.forEach((el) => (el.textContent = newHistoryDate));

	dataJSON(dateOption);
});
