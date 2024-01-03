export default function Input({...props}) {
    return (
        <input className="p-2 rounded-lg  placeholder:pr-px focus:outline-none focus:border-b " {...props} autoComplete="off" />
    )
}