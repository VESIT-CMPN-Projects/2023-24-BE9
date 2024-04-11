export default async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/hoang14/e5-law-question-matching",
        {
            headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}` },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.json();
    return result;
}


// Input example for further usage
query({"inputs": {
        "source_sentence": "That is a happy person",
        "sentences": [
            "That is a happy dog",
            "That is a very happy person",
            "Today is a sunny day"
        ]
    }}).then((response) => {
    console.log(JSON.stringify(response));
});