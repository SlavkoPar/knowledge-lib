import { useEffect, useState, useRef } from 'react';
//import { Container, Row, Col, Button, Form, ListGroup, Offcanvas, Stack } from "react-bootstrap";
import { Container, Row, Col, Button, Offcanvas } from "react-bootstrap";

import { AutoSuggestQuestions } from './categories/AutoSuggestQuestions';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFolder } from '@fortawesome/free-solid-svg-icons'


import { type IQuestionEx, type IQuestionKey } from './categories/types'

import { type IChatBotAnswer, type IChatBotDlgNavigatorMethods, type INextAnswer } from './global/types';

import Q from './assets/Q.png';
import A from './assets/A.png';
import { useData } from './hooks/useData';
import ChatBotDlgNavigator from './ChatBotDlgNavigator';
//import { useCategoryDispatch } from './categories/CategoryProvider';
//import { isMobile } from 'react-device-detect';

// type ChatBotParams = {
//     source: string;
//     tekst: string;
//     email?: string;
// };

// type ICatLevel = {
//     level: number;
//     catId: string | null;
//     header: string;
//     subCats: ICategoryRow[];
//     subCatIdSelected: string | null;
// }

interface IProps {
    show: boolean,
    onHide: () => void;
}

const isDarkMode = true;

const ChatBotDlg = ({ show, onHide }: IProps) => {
    //let { source, tekst, email } = useParams<ChatBotParams>();
    const tekst = 'rem';
    const [autoSuggestionValue, setAutoSuggestionValue] = useState(tekst!)
    //    const [setNewQuestion, getCurrQuestion, getNextChatBotAnswer] = useAI([]);
    const childRef = useRef<IChatBotDlgNavigatorMethods | null>(null);


    const [
        getChatQuestions,
        allCats, loadCats,
        allCatRows, 
        getQuestion, hasMoreAnswers, getNextAnswer,
        searchQuestions,
        addHistory, addHistoryFilter
    ] = useData("DEMO");

    console.log(typeof(getChatQuestions)); // just for linter

    useEffect(() => {
        (async () => {
            if (!allCats)
                await loadCats()
        })()
    }, [allCats, loadCats])

    //const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(null);
    //const [hasMoreAnswers, setHasMoreAnswers] = useState<boolean>(false);
    
    const [autoSuggestId, setAutoSuggestId] = useState<number>(1);
    const [showAnswer, setShowAnswer] = useState(false);
    const [chatBotAnswer, setChatBotAnswer] = useState<IChatBotAnswer | null>(null);


    const [catsSelected] = useState(true);
    const [showAutoSuggest, setShowAutoSuggest] = useState(true); //false);

    const [pastEvents, setPastEvents] = useState<IChild[]>([]);

    type ChildType = 'AUTO_SUGGEST' | 'QUESTION' | 'ANSWER';

    interface IChild {
        type: ChildType;
        isDisabled: boolean;
        txt: string,
        link: string | null,
        hasMoreAnswers?: boolean
    }
    // const deca: JSX.Element[] = [];
    // useEffect(() => {
    // 	(async () => {
    // 		//await loadCats();
    // 	})()
    // }, [])


    
    const onEntering = async (/*node: HTMLElement, isAppearing: boolean*/): Promise<any> => {
        const startTime = performance.now();
        await childRef?.current?.resetNavigator();
        // const rows = await childRef?.current?.getTopRows();
        // setTopRows(rows || []);
        const endTime = performance.now();
        const elapsedTime = endTime - startTime;
        console.log(`Execution time: ${elapsedTime} milliseconds`);
    }

    const scrollableRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     scrollToBottom();
    // }, []);

    // if (!catsLoaded) // || catsOptions.length === 0)
    //     return <div>cats not loaded...</div>


    const onSelectQuestion = async (questionKey: IQuestionKey, underFilter: string) => {
        /*
        const questionCurr = await getCurrQuestion();
        if (questionCurr) {
            console.log({ questionCurr })
            const historyFilter: IHistoryFilter = {
                questionKey: new QuestionKey(questionCurr).questionKey!,
                filter: underFilter,
                created: { time: new Date(), nickName: authUser.nickName }
            }
            await addHistoryFilter(historyFilter);
        }
        */
        await addHistoryFilter(underFilter); // nothing happens when question is NULL
        // navigate(`/categories/${categoryId}_${questionId.toString()}`)
        // const question = await getQuestion(questionId);

        // salji kasnije kad klikne na Fixed
        /* TODO proveri
        if (answer) {
            const history: IHistory = {
                questionId: questionKey.id,
                answerId: answer.id,
                fixed: undefined,
                created: { 
                    nickName: authUser.nickName, 
                    time: new Date() 
                }
            }
            addHistory(history);
        }
        */
        if (chatBotAnswer) {
            const props: IChild = {
                type: 'ANSWER',
                isDisabled: true,
                txt: chatBotAnswer.answerTitle,
                link: chatBotAnswer.answerLink
            }
            setPastEvents((prevEvents) => [...prevEvents, props]);
        }

        const questionEx: IQuestionEx = await getQuestion(questionKey);
        const { question, firstAnswer } = questionEx;
        if (!question) {
            //alert(questionEx.msg)
            return;
        }
        if (question.numOfRelatedFilters > 0) {
            setAutoSuggestionValue(question.relatedFilters[0].filter)
        }

        //const res: INewQuestion = await setNewQuestion(question);
        //let { firstChatBotAnswer, hasMoreAnswers } = res; // as unknown as INewQuestion;

        if (question) {
            const props: IChild = {
                type: 'QUESTION',
                isDisabled: true,
                txt: question.title,
                link: null
            }
            setPastEvents((prevEvents) => [...prevEvents, props]);
        }

        setAutoSuggestId((autoSuggestId) => autoSuggestId + 1);
        setShowAutoSuggest(false);
        // setSelectedQuestion(question);
        setShowAnswer(true);
        //setHasMoreAnswers(hasMoreAnswers);
        //setAnswerId((answerId) => answerId + 1);
        setChatBotAnswer(firstAnswer);
        // // salji kasnije kad klikne na Fixed
        // if (firstAnswer) {
        // 	addHistory(dbp, {
        // 		conversation: conv,
        // 		client: authUser.nickName,
        // 		questionId: question!.id!,
        // 		answerId: firstAnswer.id!,
        // 		fixed: undefined,
        // 		created: new Date()
        // 	})
        // }
    }

    const onAnswerFixed = async () => {
        const props: IChild = {
            type: 'ANSWER',
            isDisabled: true,
            txt: chatBotAnswer ? chatBotAnswer.answerTitle : 'no answer title',
            link: chatBotAnswer ? chatBotAnswer.answerLink : 'no answer link',
            hasMoreAnswers: true
        }
        setPastEvents((prevHistory) => [...prevHistory, props]);

        // const history: IHistory = {
        //     questionKey: new QuestionKey(selectedQuestion!).questionKey!,
        //     assignedAnswerKey: { topId: chatBotAnswer!.topId, id: chatBotAnswer!.id },
        //     userAction: 'Fixed',
        //     created: {
        //         nickName: 'DEMO User', //authUser.nickName,
        //         time: new Date()
        //     }
        // }
        const userAction = 'Fixed';
        addHistory(userAction);

        //
        // TODO logic 
        //

        //setHasMoreAnswers(false);
        //setAnswerId((answerId) => answerId + 1);
        setChatBotAnswer(chatBotAnswer); //undefined);
        setShowAnswer(false);
    }

    const getNextChatBotAnswer = async () => {
        // past events
        const props: IChild = {
            type: 'ANSWER',
            isDisabled: true,
            txt: chatBotAnswer ? chatBotAnswer.answerTitle : 'no answer',
            link: chatBotAnswer ? chatBotAnswer.answerLink : 'no link',
            hasMoreAnswers: true
        }
        setPastEvents((prevHistory) => [...prevHistory, props]);

        const next: INextAnswer = await getNextAnswer();
        const { nextChatBotAnswer } = next;

        if (chatBotAnswer) {
            // const history: IHistory = {
            //     questionKey: new QuestionKey(selectedQuestion!).questionKey!,
            //     assignedAnswerKey: { topId: chatBotAnswer.topId, id: chatBotAnswer.id },
            //     userAction: nextChatBotAnswer ? 'NotFixed' : 'NotClicked',
            //     created: {
            //         nickName: authUser.nickName,
            //         time: new Date()
            //     }
            // }
            const userAction = nextChatBotAnswer ? 'NotFixed' : 'NotClicked';
            addHistory(userAction);
        }

        // salji gore
        // if (nextAnswer) {
        // 	addHistory(dbp, {
        // 		conversation,
        // 		client: authUser.nickName,
        // 		questionId: selectedQuestion!.id!,
        // 		answerId: nextAnswer.id!,
        // 		fixed: hasMoreAnswers ? undefined : false,
        // 		created: new Date()
        // 	})
        // }
        //setHasMoreAnswers(hasMoreAnswers);
        //setAnswerId((answerId) => answerId + 1); PPP
        console.log('----->>>>', { nextChatBotAnswer })
        setChatBotAnswer(nextChatBotAnswer);
    }



    const QuestionComponent = (props: IChild) => {
        const { txt } = props;
        return (
            <div id={autoSuggestId.toString()} className="d-flex flex-row mx-0 justify-content-start align-items-center">
                <div className="d-flex flex-row mx-0 justify-content-start align-items-center">
                    <img width="22" height="18" src={Q} alt="Question" className='ms-1' />
                    <div className="p-1 bg-warning text-light flex-wrap text-wrap border rounded-1">{txt}</div>
                </div>
            </div>
        )
    }

    const AnswerComponent = (props: IChild) => {
        console.log('--------------------------------------AnswerComponent', props)
        const { isDisabled, txt, link } = props;
        return (
            <div
                // id={answerId.toString()}   PPP
                id={chatBotAnswer?.id}
                className={`${isDarkMode ? "dark" : "light"} mt-1 mx-1 border border-0 rounded-1`}
            >
                {/* <Row>
                    <Col xs={12} md={12} className={`${isDisabled ? 'secondary' : 'primary'} d-flex justify-content-start align-items-center p-0`}> */}

                <div className="d-flex flex-row mx-0 justify-content-start align-items-center">
                    <div className="d-flex flex-row mx-0 justify-content-start align-items-center">
                        <img width="22" height="18" src={A} alt="Answer" className='ms-1' />
                        {link
                            ? <div className="p-1 bg-info text-light flex-wrap text-wrap border rounded-1 ">
                                <a
                                    href={link!}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    className="text-light text-decoration-underline"
                                >
                                    {txt}
                                </a>
                            </div>
                            : <div className="p-1 bg-info text-light flex-wrap text-wrap border rounded-1">
                                {txt}
                            </div>

                        }
                    </div>

                    {!isDisabled && chatBotAnswer &&
                        <div>
                            <Button
                                size="sm"
                                type="button"
                                onClick={onAnswerFixed}
                                disabled={!chatBotAnswer}
                                className='align-middle ms-1 px-1  py-0'
                                variant="success"
                            >
                                Fixed
                            </Button>
                            <Button
                                size="sm"
                                type="button"
                                onClick={getNextChatBotAnswer}
                                disabled={!chatBotAnswer}
                                className='align-middle ms-1 border border-1 rounded-1 px-1 py-0'
                                variant="danger"
                            >
                                Not fixed
                            </Button>
                        </div>
                    }
                </div>

                {/* <div className="d-flex flex-row flex-wrap mx-0"> */}
                {/* <div className="card card-block  bg-info text-light">
                                <div className="card-body p-0">
                                    <div className="card-text d-flex justify-content-start align-items-center">
                                        
                                        
                                        {link ? <a href={link} target="_blank" className="text-reset text-decoration-none fw-lighter fs-6" >{link}</a> : null}
                                    </div>
                                </div>
                            </div>
                            <div className="card card-block  border-0">
                                <div className="card-body p-0 border-0">
                                    <div className="card-text">
                                        {!isDisabled && chatBotAnswer &&
                                            <div>
                                                <Button
                                                    size="sm"
                                                    type="button"
                                                    onClick={onAnswerFixed}
                                                    disabled={!chatBotAnswer}
                                                    className='align-middle ms-1 p-0'
                                                    variant="success"
                                                >
                                                    Fixed
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    type="button"
                                                    onClick={getNextChatBotAnswer}
                                                    disabled={!chatBotAnswer}
                                                    className='align-middle ms-1 border border-1 rounded-1 p-0'
                                                    variant="danger"
                                                >
                                                    Not fixed
                                                </Button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div> */}

                {/* </div> */}

                {/* </Col>
                </Row> */}
            </div>
        );
    };

    const AutoSuggestComponent = (props: IChild) => {
        const { isDisabled, txt } = props;
        return <div className="dark">
            <label className="text-warning">Please enter the Question</label>
            <div className="text-start">
                <div className="questions">
                    {isDisabled &&
                        <div>
                            {txt}
                        </div>
                    }
                    {!isDisabled &&
                        <AutoSuggestQuestions
                            tekst={txt}
                            onSelectQuestion={onSelectQuestion}
                            allCats={allCats!}
                            searchQuestions={searchQuestions}
                        />
                    }
                </div>
            </div>
        </div>
    }

    // const scrollToBottom = () => {
    //     scrollableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    // };
    console.log("=====================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> rendering ChatBotDlg")
    if (!allCats)
        return 'loading ...'

    return (
        <div className="pe-6 overflow-auto chat-bot-dlg">
            <style>{`
                .card-header {
                    padding: 0.0rem 0.03rem;
                    padding-right: 0;
                    font-size: 0.8rem;
                }
                // .card-header button  {
                //     border: 0.3px solid silver;
                //     border-radius: 3px;
                //     text-align: left;
                // }

                .card-body {
                    padding: 0.0rem 0.5rem;
                    padding-right: 0;
                    font-size: 0.6rem;
                }

                .accordion-body {
                    padding: 0.3rem 0.3rem;
                    font-size: 0.6rem;
                }

                .accordion-button  {
                    padding: 0rem 0.2rem !important;
                    padding-right: 0 !important;
                    border: 0; //px solid inset;
                    //border-radius: 3px;
                    //text-align: left;
                    font-size: 1rem;
                }
                    
                ul {
                    list-style-type: none;
                }

                .cat-link {
                    // text-decoration:  none;
                    color: inherit;
                }

                .cat-link.btn {
                    padding: 0;
                }

                .cat-title {
                    // text-decoration:  none;
                    color: inherit;
                }

                .accordion-button.hide-icon::after {
                    display: none;
                    padding: 0rem 0.2rem !important;
                    padding-right: 0 !important;
                }
            }
            `}</style>
            {/* backdrop="static" */}
            <Offcanvas show={show} onHide={onHide} placement='end' scroll={true} backdrop={true} onEntering={onEntering}> {/* backdropClassName='chat-bot-dlg' */}
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="fs-6">
                        I am your Buddy
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-0 border border-1 rounded-3">
                    <Container id='container' fluid className='text-primary'> {/* align-items-center" */}
                        <Row className="m-0">
                            <Col>
                                <ChatBotDlgNavigator allCatRows={allCatRows} ref={childRef} />
                            </Col>
                        </Row>
                        {/* badge */}
                        <Row className="m-0">
                            <Col className='border border-0 border-primary mx-1 text-white p-0'>
                                {/* <div className="d-inline"> */}
                                {/* <div key='Welcome'>
                                    <p><b>Welcome</b>, I am Buddy and I am here to help You</p>
                                </div> */}

                                {/* <div className='border border-0 border-primary mx-0 text-white'>
                                    {catLevels.map((catLevel) =>
                                        <CatLevelComponent key={catLevel.level} {...catLevel} />
                                    )}
                                </div> */}

                                <div key='history' className='history'>
                                    {
                                        pastEvents.map(childProps => {
                                            switch (childProps.type) {
                                                case 'AUTO_SUGGEST':
                                                    return <AutoSuggestComponent {...childProps} />;
                                                case 'QUESTION':
                                                    return <QuestionComponent {...childProps} />;
                                                case 'ANSWER':
                                                    return <AnswerComponent {...childProps} />;
                                                default:
                                                    return <div>unknown</div>
                                            }
                                        })
                                    }
                                </div>

                                {showAnswer &&
                                    <div key="answer">
                                        <AnswerComponent
                                            type={'ANSWER'}
                                            isDisabled={false}
                                            txt={chatBotAnswer ? chatBotAnswer.answerTitle : 'no answers'}
                                            hasMoreAnswers={hasMoreAnswers}
                                            link={chatBotAnswer ? chatBotAnswer.answerLink : ''}
                                        />
                                    </div>
                                }

                                {catsSelected && !showAutoSuggest &&
                                    <Button
                                        key="newQuestion"
                                        variant="secondary"
                                        size="sm"
                                        type="button"
                                        onClick={() => {
                                            setAutoSuggestId(autoSuggestId + 1);
                                            setShowAutoSuggest(true);
                                        }}
                                        className='m-1 border border-1 rounded-1 py-0'
                                    >
                                        New Question
                                    </Button>
                                }

                                {showAutoSuggest &&
                                    <div className="pb-35 questions">
                                        <AutoSuggestComponent
                                            type={'AUTO_SUGGEST'}
                                            isDisabled={false}
                                            txt={autoSuggestionValue!}
                                            link={null}
                                        />
                                    </div>
                                }
                                {/* </div> */}
                                <div ref={scrollableRef}>dno dna</div>
                            </Col>
                        </Row>
                    </Container>
                </Offcanvas.Body>
            </Offcanvas>

        </div>
    )
};

export default ChatBotDlg;

/*
  <div className="offcanvas offcanvas-end offcanvas-scroll show" tabIndex={-1} id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasExampleLabel">Offcanvas</h5>
                <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <div>
                    Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists, etc.
                </div>
                <div className="dropdown mt-3">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown">
                        Dropdown buttonnn
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <li><a className="dropdown-item" href="#">Action</a></li>
                        <li><a className="dropdown-item" href="#">Another action</a></li>
                        <li><a className="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                </div>
            </div>
        </div>
*/