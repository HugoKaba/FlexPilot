import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

export const FieldInput = (props: InputHTMLAttributes<HTMLInputElement>) => <input {...props} />
export const FieldSelect = (props: SelectHTMLAttributes<HTMLSelectElement>) => <select {...props} />
export const FieldTextarea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} />
