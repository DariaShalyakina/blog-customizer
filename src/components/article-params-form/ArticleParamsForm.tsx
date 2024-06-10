import { ArrowButton } from 'components/arrow-button';
import { Button } from 'components/button';
import { Select } from '../select';
import { RadioGroup } from '../radio-group';
import { Separator } from '../separator';
import { Text } from '../text';
import {
	ArticleStateType,
	defaultArticleState,
	contentWidthArr,
	fontColors,
	fontFamilyOptions,
	backgroundColors,
	fontSizeOptions,
} from '../../constants/articleProps';

import { useState, useRef } from 'react';
import { useOutsideClickClose } from '../select/hooks/useOutsideClickClose';

import styles from './ArticleParamsForm.module.scss';
import clsx from 'clsx';

interface ArticleParamsFormProps {
	onSubmit?: (formState: ArticleStateType) => void;
	onReset?: () => void;
}

export const ArticleParamsForm = ({
	onSubmit,
	onReset,
}: ArticleParamsFormProps) => {
	// отслеживание состояния видимости формы
	const [isOpen, setIsOpen] = useState(false);

	// хук для отслеживания состояния формы
	const [formState, setFormState] =
		useState<ArticleStateType>(defaultArticleState);

	// хранение ссылки на корневой элемент формы
	const rootRef = useRef<HTMLElement>(null);

	// переключение состояния видимости формы
	const toggleForm = () => {
		setIsOpen(!isOpen);
	};

	// хук для закрытия формы при клике вне ее области
	useOutsideClickClose({
		isOpen: isOpen,
		rootRef: rootRef,
		onChange: setIsOpen,
	});

	// обработка события отправки формы
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (onSubmit) {
			onSubmit(formState);
		}
	};

	// обработка события сброса формы
	const handleReset = (e: React.FormEvent) => {
		e.preventDefault();
		if (onReset) {
			onReset();
		}
		setFormState(defaultArticleState);
	};

	// обновление состояния формы
	const handleFormStateChange = (newState: Partial<ArticleStateType>) => {
		if (typeof newState === 'object' && newState !== null) {
			setFormState({ ...formState, ...newState });
		} else {
			console.error('Invalid newState type:', typeof newState);
		}
	};
	// Возвращаем разметку компонента
	return (
		<>
			<ArrowButton onClick={toggleForm} isOpen={isOpen} />
			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isOpen,
				})}
				ref={rootRef}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<Text as='h2' size={31} weight={800} uppercase>
						Задайте параметры
					</Text>
					<Select
						title={'шрифт'}
						selected={formState.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={(option) =>
							handleFormStateChange({ fontFamilyOption: option })
						}
					/>
					<RadioGroup
						title={'размер шрифта'}
						name={'fontSize'}
						selected={formState.fontSizeOption}
						options={fontSizeOptions}
						onChange={(option) => {
							setFormState({ ...formState, fontSizeOption: option });
						}}
					/>
					<Select
						title={'цвет шрифта'}
						selected={formState.fontColor}
						options={fontColors}
						onChange={(option) => {
							setFormState({ ...formState, fontColor: option });
						}}
					/>

					<Separator />

					<Select
						title={'цвет фона'}
						selected={formState.backgroundColor}
						options={backgroundColors}
						onChange={(option) => {
							setFormState({ ...formState, backgroundColor: option });
						}}
					/>
					<Select
						title={'ширина контента'}
						selected={formState.contentWidth}
						options={contentWidthArr}
						onChange={(option) => {
							setFormState({ ...formState, contentWidth: option });
						}}
					/>

					<div className={styles.bottomContainer}>
						<Button title='Сбросить' type='reset' />
						<Button title='Применить' type='submit' />
					</div>
				</form>
			</aside>
		</>
	);
};
