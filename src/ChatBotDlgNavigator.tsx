import { useContext, type ReactNode, forwardRef, useImperativeHandle, useState } from 'react';
import { Accordion, AccordionContext, Button, Card, useAccordionButton } from "react-bootstrap";
//import { useNavigate } from "react-router-dom";


// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFolder } from '@fortawesome/free-solid-svg-icons'

import { type ICat } from '@/categories/types';

//import Q from '@/assets/Q.png';
//import A from '@/assets/A.png';
import type { AccordionEventKey } from 'react-bootstrap/esm/AccordionContext';
import type { IChatBotDlgNavigatorMethods } from './global/types';
// import { useCategoryDispatch } from '@/categories/CategoryProvider';


const PINK = 'rgba(255, 192, 203, 0.6)';
const BLUE = 'rgb(224, 207, 252)';

const ChatBotDlgNavigator = forwardRef<IChatBotDlgNavigatorMethods, { allCatRows: ICat[] }>(
    ({ allCatRows }, ref) => {

        //const navigate = useNavigate();
        // const linkGo = (link: string) => {
        //     navigate(link);
        // }

        const [topRows, setTopRows] = useState<ICat[]>([]);

        function ContextAwareToggle({ children, eventKey, hasSubCategories, callback }:
            { children: ReactNode; eventKey: AccordionEventKey; hasSubCategories: boolean; callback?: (eventKey?: AccordionEventKey) => void }) {

            const { activeEventKey } = useContext(AccordionContext);
            const decoratedOnClick = useAccordionButton(
                String(eventKey ?? ''),
                () => callback && callback(eventKey),
            );
            const isCurrentEventKey = activeEventKey === eventKey;
            return (
                <button
                    type="button"
                    className={`accordion-button${!hasSubCategories ? ' hide-icon' : ''}`}
                    style={{
                        backgroundColor: isCurrentEventKey ? PINK : BLUE
                    }}
                    onClick={decoratedOnClick}
                >
                    {children}
                </button>
            );
        }

        const CatRow = ({ row }: { row: ICat }) => {
            return (
                <Card>
                    <Card.Header>
                        <ContextAwareToggle eventKey={row.id} hasSubCategories={row.hasSubCategories}>
                            {row.link
                                // onClick={() => navigate(`${row.link}/from_chat`)}
                                ? <Button href={`https://slavkopar.github.io/knowledge`} variant="link" className="cat-link" target="_blank" >{row.title}</Button>
                                : <span className="cat-title">{row.title}</span>
                            }
                        </ContextAwareToggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={row.id}>
                        <Card.Body>
                            {row.hasSubCategories &&
                                <CatList rows={row.catRows} />
                            }
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
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
        const resetNavigator = (): void => {
            setTopRows([]);
            allCatRows.forEach(async (catRow) => {
                catRow.catRows = [];
                if (catRow.parentId === null) {
                    await loadSubTree(catRow);
                    setTopRows(prevTopRows => [...prevTopRows, catRow]);
                }
            });
        }


        useImperativeHandle(ref, () => ({
            resetNavigator
        }), []);

        return (
            <Accordion defaultActiveKey="" alwaysOpen={true} onSelect={onSelectCategory} >
                <CatList rows={topRows}></CatList>
            </Accordion>
        );
    });

export default ChatBotDlgNavigator;