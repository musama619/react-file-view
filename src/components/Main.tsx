import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	appendFileData,
	removeFileData,
	setComponentState,
	storeFileData,
} from "../redux/fileSlice";
import FilePreview from "./FilePreview";
import { MdCancel } from "react-icons/md";
import { RootState } from "../../store";
import ImageSlider from "./ImageSlider";
import { Props } from "./interface";

export const Main: React.FC<Props> = ({
	files,
	url,
	downloadFile,
	removeFile,
	showFileSize,
	showSliderCount,
	multiple,
	accept,
	maxFileSize,
	maxFiles,
	width,
	rounded,
	height,
	fileHeight,
	fileWidth,
	onChange,
	onRemove,
	onError,
	getFiles,
	onClick,
}) => {
	const dispatcher = useDispatch();

	const fileData = useSelector((state: RootState) => state.file.fileData);
	const fileState = useSelector((state: RootState) => state.file.fileState);
	const componentState = useSelector((state: RootState) => state.file.componentState);

	const checkErrors = (files: File[]) => {
		let hasError = false;
		if (maxFiles && (fileData.length + files.length > maxFiles || files.length > maxFiles)) {
			hasError = true;
			if (onError) {
				onError(new Error(`Max ${maxFiles} files are allowed to be selected`));
			}
		}

		if (maxFileSize) {
			files.forEach((file: File) => {
				if (file.size > maxFileSize) {
					hasError = true;
					if (onError) {
						onError(new Error(`File size limit exceeded: ${file.name}`));
					}
					return;
				}
			});
		}

		return hasError;
	};

	useEffect(() => {
		async function fetchData() {
			try {
				if (url) {
					const response = await fetch(url);
					const blob = await response.blob();
					const file = new File([blob], "filename", {
						type: blob.type,
					});
					dispatcher(storeFileData({ files: [file] }));
				}
			} catch (err) {
				if (err instanceof Error) {
					if (onError) {
						onError(err);
					}
					throw err;
				}
			}
		}
		fetchData();

		if (files.length > 0) {
			if (!checkErrors(files)) {
				dispatcher(appendFileData({ files: files }));
			}
		}
	}, [url, files]);

	useEffect(() => {
		dispatcher(
			setComponentState({
				downloadFile: downloadFile != undefined ? downloadFile : true,
				removeFile: removeFile != undefined ? removeFile : true,
				showFileSize: showFileSize != undefined ? showFileSize : true,
				showSliderCount: showSliderCount != undefined ? showSliderCount : true,
				rounded: rounded != undefined ? rounded : true,
				fileHeight: fileHeight ?? "h-32",
				fileWidth: fileWidth ?? "w-44",
			})
		);
	}, [downloadFile, removeFile, showFileSize, showSliderCount, fileHeight, fileWidth, rounded]);

	const handleImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const files = Array.from(e.target.files || []);

		if (!checkErrors(files)) {
			dispatcher(appendFileData({ files: files }));
		}
	};

	const remove = (file: File) => {
		dispatcher(removeFileData(file));
		if (onRemove) {
			onRemove(file);
		}
	};

	const handleClick = (file: File) => {
		if (onClick) {
			onClick(file);
		}
	};
	if (getFiles) {
		getFiles(fileData);
	}

	if (fileState.zoom) {
		return (
			<div>
				<ImageSlider />
			</div>
		);
	}

	return (
			<div className="w-full mt-3">
				<div className="flex flex-row max-h-2">
					<div className={`${width ?? `basis-11/12`} mx-auto`}>
						{fileData.length > 0 ? (
							<div>
								<div className="flex justify-between  bg-gray-200 ">
									{/* <div className="h-10 text-sm pt-2 font-medium"></div> */}
									<div className="h-10 text-sm pt-2 ml-2 font-medium">
										<span className="bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
											{`Files: ${fileData.length}`}
										</span>
									</div>
									<label
										htmlFor="fileInput"
										className="cursor-pointer py-1 px-2 mt-1 mr-2 mb-1 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
									>
										+ Add more
										<input
											id="fileInput"
											type="file"
											onChange={(e) => {
												handleImage(e);
												if (onChange) {
													onChange(e);
												}
											}}
											style={{ display: "none" }}
											multiple={multiple ?? true}
											accept={accept ?? ""}
										/>
									</label>
								</div>
							</div>
						) : (
							<></>
						)}

						<div
							className={`${height && `overflow-auto ${height}`
								} flex flex-row flex-wrap gap-4 p-6 bg-stone-100 border border-gray-100 shadow dark:bg-gray-800 `}
						>
							{fileData.length > 0 ? (
								fileData.map((file, idx) => {
									return (
										<div key={idx} className="relative pb-5 group " onClick={() => handleClick(file)}>
											<div className="ml-9">
												{componentState.removeFile ? (
													<button
														data-testid="remove-file-button"
														onClick={() => remove(file)}
														className="absolute -top-1 right-0 z-10 text-black opacity-0 group-hover:opacity-100 transition-opacity"
													>
														<MdCancel />
													</button>
												) : (
													<></>
												)}
											</div>
											<div className="clear-right">
												<FilePreview file={file} index={idx} />
											</div>
										</div>
									);
								})
							) : (
								<label
									htmlFor="fileInput"
									className="mx-auto cursor-pointer hover:underline flex items-center "
								>
									Browse files
									<input
										id="fileInput"
										type="file"
										onChange={(e) => {
											handleImage(e);
											if (onChange) {
												onChange(e);
											}
										}}
										multiple={multiple ?? true}
										accept={accept ?? ""}
										style={{ display: "none" }}
									/>
								</label>
							)}
						</div>
					</div>
				</div>
			</div>
	);
};

