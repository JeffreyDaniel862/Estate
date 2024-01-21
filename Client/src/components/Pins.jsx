export default function Pins({ children, className }) {

    let cssClass = "flex gap-1 items-center ";

    if(className){
        cssClass += className;
    }

    return (
        <p className={cssClass}>
            {children}
        </p>
    )
}