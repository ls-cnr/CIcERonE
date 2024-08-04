from langchain_community.llms import Ollama
from langchain_community.embeddings import OllamaEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
#from langchain_chroma import Chroma

# Inizializza il modello Ollama
llm = Ollama(model="gemma2:latest")

# Inizializza embeddings e vector store
embeddings = OllamaEmbeddings()
vectorstore = None  # Questo dovrebbe essere inizializzato con i tuoi dati

# Queste variabili dovrebbero essere definite o importate da qualche parte
mental_space_lattice = ""  # Definisci questa variabile
instructions_mental_space = ""  # Definisci questa variabile

def generate_new_lattice(current_lattice, interview):
    template = (
        "You are an Analyst who is eliciting knowledge for the {domain_of_interest}."
        "Use the theory of Mental Space to interpret data: {context}.\n\n"
        "Your responsibility is to build or update a Mental Space Lattice: {mental_space_lattice}"
        "The current Mental Space Lattice is: {lattice}."
        "Use the transcript from the following interview to update the Mental Space Lattice: {interview}. \n\n"
        "with the following {instructions}.\n\n"
        "Print the new Mental Space Lattice only; do not put courtesy sentences, no preamble and no conclusion."
    )

    prompt = ChatPromptTemplate.from_template(template)
    chain = prompt | llm | StrOutputParser()

    return chain.invoke({
        "domain_of_interest": "RSA, Assistive Residences for the Elderly",
        "context": vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 6}),
        "mental_space_lattice": mental_space_lattice,
        "lattice": current_lattice,
        "interview": interview,
        "instructions": instructions_mental_space,
    })

def query_implicit_knowledge(lattice):
    template = (
        "You are a Software Engineer who is eliciting requirements for the {domain_of_interest}."
        "Domain knowledge is stored in a Mental Space Lattice: {lattice}, "
        "could you suggest how to conduct the interview to the next caregiver?"
        "there is something unclear to investigate? "
        "there is implicit knowledge to discover?"
        "Could you produce a list of question to ask (and their rationale)? "
    )

    prompt = ChatPromptTemplate.from_template(template)
    chain = prompt | llm | StrOutputParser()

    return chain.invoke({
        "domain_of_interest": "RSA, Assistive Residences for the Elderly",
        "lattice": lattice
    })