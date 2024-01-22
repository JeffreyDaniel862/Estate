export default function Input({ checkBox, labeledInput, labelName, labelClass, textarea, className, ...props }) {

    let cssClasses = "p-3 rounded-lg  placeholder:pr-px focus:outline-none focus:border-b "

    if (className) {
        cssClasses += className;
    }

    if (textarea) return <textarea className={cssClasses} {...props} />

    if (labeledInput) {
        return (
            <div className="flex items-center gap-2">
                <p className={labelClass ? labelClass : ""}>{labelName}</p>
                <input className={cssClasses} {...props} />
            </div>
        )
    }

    if (checkBox) {
        return (
            <div className="flex gap-2">
                <input type="checkbox" className="w-5" {...props} />
                <span>{labelName}</span>
            </div>
        )
    }



    return (
        <input className={cssClasses} {...props} autoComplete="off" />
    )
}