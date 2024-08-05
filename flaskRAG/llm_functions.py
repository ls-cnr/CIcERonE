from langchain_community.llms import Ollama
from langchain_community.embeddings import OllamaEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
#from langchain_chroma import Chroma

# Inizializza il modello Ollama
llm = Ollama(model="gemma2:latest")

# Inizializza embeddings e vector store
embeddings = OllamaEmbeddings()
#vectorstore = None  # Questo dovrebbe essere inizializzato con i tuoi dati

# Queste variabili dovrebbero essere definite o importate da qualche parte
#mental_space_lattice = ""  # Definisci questa variabile
#instructions_mental_space = ""  # Definisci questa variabile

def generate_new_lattice(current_lattice, source, interview):
    template = (
        "Play the role of an Analyst eliciting knowledge from domain of interest."
         "Your input come from {source} and interview data is {interview}"
        "Your responsibility is to maintain updated the Mental Space Lattice: {mental_space_lattice}"
        "Task A) Identify mental spaces that unfold by an interview"
        "1) Copy all the existing sections and phrases of the current Mental Space Lattice "
        "in the new version. 2) Select all the relevant portions of text from the interview."
        "3) For each portion, update the Mental Space Lattice3.1) identify the topic of the phrase"
        "3.2) For each topic, update the Mental Space Lattice"
        "3.2.1) check if the current mental space lattice already contains the topic or a very close topic. "
        "If not, then add a new mental space, including the phrase. "
        "Otherwise, add the phrase to the existing mental space."
        "3.2.2) annotate the phrase with the viewpoint."
        
        "Task B) Optimize the Mental Space Lattice"
        "1) Remove empty mental spaces"
        "2) Merge mental spaces that are very similar"
        "3) If a mental space contains more than 10 sentences,"
        "3.1) classify sentences in the space in subgroups"
        "3.2) replace the original mental space with separate mental spaces for each subgroup."
        
        "Task C) Release the Mental Space Lattice"
        "1) Generate a textual document that represents the mental space lattice."
        "2) Create a section for each mental space identified during construction."
        "3) Format each section:"
        "3.1) Use the main topic of each mental space as a heading for the corresponding section."
        "3.2) Record phases that generated the mental space as sentences, "
        "3.3) Record the source of each phrase by enclosing it in brackets ([ ])."
        
        "Print the new Mental Space Lattice only; do not put courtesy sentences, no preamble and no conclusion."
    )

    prompt = ChatPromptTemplate.from_template(template)
    chain = prompt | llm | StrOutputParser()

    return chain.invoke({
#        "context": vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 6}),
        "mental_space_lattice": current_lattice,
#        "lattice": current_lattice,
        "source": source,
        "interview": interview,
#        "instructions": instructions_mental_space,
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