class CheckListItem
{
	constructor(text)
	{
		this.container = document.createElement("DIV");
		this.container.className = "checklist-item";

		this.checkbox = document.createElement("INPUT");
		this.checkbox.type = "checkbox";
		this.checkbox.onclick = () => 
		{
			this.toggle();
		};
		this.container.appendChild(this.checkbox);

		this.span = document.createElement("SPAN");
		this.span.innerHTML = text;
		this.container.appendChild(this.span);
	}

	appendTo(element)
	{
		element.appendChild(this.container);
	}

	toggle()
	{
		this.container.classList.toggle("checked");
	}

	clear()
	{
		this.container.classList.remove("checked");
		this.checkbox.checked = false;
	}
}
