'use client';

import Image from 'next/image';
import styles from './EditorBio.module.css';

/**
 * Editor Bio component for displaying information about the article's author
 * @param {Object} editor - The editor object containing name, title, bio, and image
 */
export default function EditorBio({ editor }) {
  if (!editor) return null;

  return (
    <div className={styles.editorBioContainer}>
      <div className={styles.editorImageWrapper}>
        {editor.image ? (
          <Image 
            src={editor.image}
            alt={editor.name}
            width={80}
            height={80}
            className={styles.editorImage}
          />
        ) : (
          <div className={styles.editorInitials}>
            {editor.name.split(' ').map(n => n[0]).join('')}
          </div>
        )}
      </div>
      <div className={styles.editorInfo}>
        <h4 className={styles.editorName}>{editor.name}</h4>
        <p className={styles.editorTitle}>{editor.title}</p>
        <p className={styles.editorBio}>{editor.bio}</p>
      </div>
    </div>
  );
}
