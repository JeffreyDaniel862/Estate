export default function Button({children, animate, primaryColor, secondaryColor, className, ...props}){

    let cssClasses = 'p-3 rounded-lg disabled:opacity-80  ';

    if(className){
        cssClasses += className;
    }

    if(animate){
        cssClasses += "hover:-translate-y-1 transition ease-in-out delay-150 "; 
    }

    if(primaryColor){
        cssClasses += "bg-slate-700 hover:bg-slate-800 text-white ";
    }

    if(secondaryColor){
        cssClasses += 'bg-red-600 hover:bg-red-800 text-white ';
    }
    
    return (
        <button className={cssClasses} {...props}>{children}</button>
    )
}