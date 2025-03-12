export default function Greeting () {
    const userName = process.env.NEXT_PUBLIC_USER_NAME;

    return <div className="greeting">Hello {userName} !</div>
}