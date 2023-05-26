import { format, formatDistanceToNow, intervalToDuration } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FormEvent, useState, ChangeEvent, InvalidEvent } from 'react';
import { Avatar } from './Avatar';
import { Comment } from './Comment';
import styles from './Post.module.css';

//estado = variáveis que eu quero que o componente monitore

//setComments - função do react responsável por alterar o valor do comments

interface Author {
    name: string;
    role: string;
    avatarUrl: string;
    publishedAt: Date;
    content: Content[];
    author: Author;
}

interface Content {
    type: 'paragraph' | 'link';
    content: string;
}

interface PostProps {
    author: Author;
    publishedAt: Date;
    content: string;
}

export function Post(props:Author) {
// export function Post({ author, publishedAt, content }: PostProps)    se quiser usar desestruturação
    const [comments, setComments] = useState([
        'Post muito bacana, hein?!',
    ]);

    const [newCommentText, setNewCommentText] = useState('')

    const publishedDateFormated = format(props.publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {
        locale: ptBR,
    });

    const pusblishedDateRelativeToNow = formatDistanceToNow(props.publishedAt, {
        locale: ptBR,
        addSuffix: true,
    });

    function handleCreateNewComment(event: FormEvent) {
        event.preventDefault()
        // imutabilidade
        setComments([...comments, newCommentText]);
        setNewCommentText('')
    };

    function handleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
        event.target.setCustomValidity('');
        setNewCommentText(event.target.value);
    };

    function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
        event.target.setCustomValidity('Esse campo é obrigatório!');
    };

    function deleteComment(commentToDelete: string) {
        //imutabilidade -> as variáveis não sofrem mutação, nó criamos um novo valor (um novo espaço na memória)
        const commentsWithoutDeletedOne = comments.filter(comment => {
            return comment !== commentToDelete;
        })
        setComments(commentsWithoutDeletedOne);
    };

    const isNewCommentEmpty = newCommentText.length === 0;

    return(
        <article className={styles.post}>
            <header>
                <div className={styles.author}>
                    <Avatar src={props.author.avatarUrl} />
                    <div className={styles.authorInfo}>
                        <strong>{props.author.name}</strong>
                        <span>{props.author.role}</span>
                    </div>
                </div>
                <time title={publishedDateFormated} dateTime={props.publishedAt.toISOString()}>
                    {pusblishedDateRelativeToNow}
                </time>
            </header>

            <div className={styles.content}>
                {props.content.map(line => {
                    if (line.type === 'paragraph'){
                        return <p key={line.content}>{line.content}</p>
                    } else if (line.type === 'link'){
                        return <p key={line.content}><a href="#">{line.content}</a></p>
                    }
                })}
            </div>

            <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
                <strong>Deixe seu feedback</strong>

                <textarea 
                    name= 'comment'
                    placeholder='Deixe um comentário'
                    value={newCommentText}
                    onChange={handleNewCommentChange}
                    onInvalid={handleNewCommentInvalid}
                    required
                />
                
                <footer>
                    <button type='submit' disabled={isNewCommentEmpty}>
                        Publicar
                    </button>
                </footer>
            </form>

            <div className={styles.commentList}>
                {comments.map(comment => {
                    return (
                        <Comment 
                            key={comment} 
                            content={comment} 
                            onDeleteComment={deleteComment}
                        />
                    )
                })}
            </div>
        </article>
    )
}