import { forwardRef, useImperativeHandle, useState } from 'react';
import { Accordion } from "react-bootstrap";
//import { useNavigate } from "react-router-dom";


// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFolder } from '@fortawesome/free-solid-svg-icons'

import { type ICat, type ICategoryKey, type IQuestionShort } from '@/categories/types';

//import Q from '@/assets/Q.png';
//import A from '@/assets/A.png';
import type { AccordionEventKey } from 'react-bootstrap/esm/AccordionContext';
import type { IChatBotDlgNavigatorMethods } from './global/types';
import { useData } from './hooks/useData';
import { formatDateShort } from './utilities';
// import { useCategoryDispatch } from '@/categories/CategoryProvider';


// const PINK = 'rgba(255, 192, 203, 0.6)';
// const BLUE = 'rgb(224, 207, 252)';

const ChatBotDlgNavigator = forwardRef<IChatBotDlgNavigatorMethods, { allCatRows: ICat[] }>(
    ({ allCatRows }, ref) => {

        //const navigate = useNavigate();
        // const linkGo = (link: string) => {
        //     navigate(link);
        // }

        const [
            getChatQuestions
        ] = useData("DEMO");

        const [topRows, setTopRows] = useState<ICat[]>([]);

        /*
        function ContextAwareToggle({ children, eventKey, hasSubCategories, callback }:
            { children: ReactNode; eventKey: AccordionEventKey; hasSubCategories: boolean; callback?: (eventKey?: AccordionEventKey) => void }) {

            const { activeEventKey } = useContext(AccordionContext);
            const decoratedOnClick = useAccordionButton(
                String(eventKey ?? ''),
                () => callback && callback(eventKey),
            );
            const isCurrentEventKey = activeEventKey === eventKey;
            return (
                <Button
                    type="button"
                    className={`accordion-button${!hasSubCategories ? ' hide-icon' : ''}`}
                    style={{
                        backgroundColor: isCurrentEventKey ? PINK : BLUE
                    }}
                    onClick={decoratedOnClick}
                >
                    {children}
                </Button>
            );
        }
        */

        const navig = async (row: ICat) => {
            const { topId, id } = row;
            const categoryKey: ICategoryKey = { topId, id, parentId: null }
            const questionShortEx = await getChatQuestions(categoryKey);
            const { rows } = questionShortEx;
            console.log(questionShortEx);
            //  <th>Id</th>
            let sHTML = "<table id='questionsTable' style='font-size: 11px;'><thead><tr> \
            <th>Title</th>\
            <th>#Answers</th>\
            <th>Who</th>\
            <th>When</th>\
            </tr></thead><tbody>";

            // <td>${q.Id}</td>\
            for (let i=0; i < rows.length; i++) {
                const q: IQuestionShort = rows[i];
                const when = formatDateShort(new Date(q.When));
                sHTML += `<tr>\
                <td width='30%'>${q.Title}</td>\
                <td>${q.AssignedAnswers}</td>\
                <td>${q.Who}</td>\
                <td>${when}</td>\
                </tr>`;
            }
            sHTML += "</tbody></table>";
            const divQuestions = document.getElementById('divQuestions');
            if (divQuestions) {
                divQuestions.innerHTML = sHTML;
            }
        }

        // const CatRow = ({ row }: { row: ICat }) => {
        //     return (
        //         <Card>
        //             <Card.Header>
        //                 <ContextAwareToggle eventKey={row.id} hasSubCategories={row.hasSubCategories}>
        //                     {row.link
        //                         ? <Button onClick={() => navig(row)} variant="link" className="cat-link">{row.title}</Button>
        //                         //? onClick={() => navigate(`${row.link}/from_chat`)}
        //                         //? <Button href={`https://slavkopar.github.io/knowledge`} variant="link" className="cat-link" target="_blank" >{row.title}</Button>
        //                         : <span className="cat-title">{row.title}</span>
        //                     }
        //                 </ContextAwareToggle>
        //             </Card.Header>
        //             <Accordion.Collapse eventKey={row.id}>
        //                 <Card.Body>
        //                     {row.hasSubCategories &&
        //                         <CatList rows={row.catRows} />
        //                     }
        //                 </Card.Body>
        //             </Accordion.Collapse>
        //         </Card>
        //     )
        // }
     const CatRow = ({ row }: { row: ICat }) => {
            const { id, hasSubCategories, numOfQuestions, title } = row;
            return (
                <Accordion.Item eventKey={id}>
                    <Accordion.Header className={`${!hasSubCategories ? 'hide-icon' : ''}`}>
                        {/* <ContextAwareToggle eventKey={row.id} hasSubCategories={row.hasSubCategories} isExpanded={row.isExpanded ? true : false}> */}
                            {row.link
                                ? <a href="#" className="cat-link" onClick={() => navig(row)}>{title}</a>
                                : <span className="cat-title">{title}</span>
                            }
                            { numOfQuestions > 0 &&
                                <i className='ms-1 fw-light'>{numOfQuestions}Q</i>
                            }
                        {/* </ContextAwareToggle> */}
                    </Accordion.Header>
                    <Accordion.Body>
                        {/* <Card.Body> */}
                            {row.hasSubCategories &&
                                <CatList rows={row.catRows} />
                            }
                        {/* </Card.Body> */}
                    </Accordion.Body>
                    {/* <Accordion.Collapse eventKey={row.id}>
                        <Card.Body>
                            {row.hasSubCategories &&
                                <CatList rows={row.categoryRows} />
                            }
                        </Card.Body>
                    </Accordion.Collapse> */}
                </Accordion.Item>
            )
        }

        const CatList = ({ rows }: { rows: ICat[] }) => {
            return (
                <>
                    {rows.map((row) => (
                        <CatRow key={row.id} row={row} />
                    ))}
                </>
            )
        }

        const onSelectCategory = async (eventKey: AccordionEventKey, e: React.SyntheticEvent<unknown>) => {
            const id = eventKey![0];
            const parentCat = allCatRows.find(x => id === x.id);
            if (parentCat) {
                e.stopPropagation();
                e.preventDefault();
            }
            // console.log('onSelectCategory', { parentCat, eventKey, e });
        }

        //////////////////
        const loadSubTree = async (catRow: ICat): Promise<boolean> => {
            const { id } = catRow;
            allCatRows.forEach(async (row) => {
                if (row.id !== id && row.parentId === id) {
                    await loadSubTree(row);
                    catRow.catRows.push(row);
                }
            });
            return true;
        };

        //////////////////
        useImperativeHandle(ref, () => ({
            resetNavigator: () => {
                setTopRows([]);
                allCatRows.forEach(async (catRow) => {
                    catRow.catRows = [];
                    if (catRow.parentId === null) {
                        await loadSubTree(catRow);
                        setTopRows(prevTopRows => [...prevTopRows, catRow]);
                    }
                });
            }
        }), [allCatRows]);

        return (
            <Accordion defaultActiveKey="" alwaysOpen={true} onSelect={onSelectCategory} >
                <CatList rows={topRows}></CatList>
            </Accordion>
        );
    });

export default ChatBotDlgNavigator;