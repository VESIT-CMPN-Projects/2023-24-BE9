import FormElement from "./FormElement"

export default function FormGroup({questions, formPageValues, formPageNumber, setFormPageValues}) {
    return (
        questions.map((question, index) => 
        <FormElement 
          question={question} 
          key={question}
          formPageValues={formPageValues} 
          formPageNumber={formPageNumber} 
          index = {index}
          setFormPageValues={setFormPageValues}
        />
      )
    )
}