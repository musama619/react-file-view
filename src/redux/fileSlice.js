import { createSlice } from '@reduxjs/toolkit'

const file = createSlice({
    name: 'file',
    initialState: {
        fileData: [],
        fileState: {
            zoom: false, 
            fileSrc: null, 
            index: null, 
            isImage: false, 
            fileName: null, 
            type: null, 
            size: 0
        },
        componentState: {
            showFileSize: false,
            showSliderCount: true,
            downloadFile: true,
            removeFile: true
        }
    },
    reducers: {
        storeFileData(state, action) {
            const { files } = action.payload
            state.fileData = files
        },
        setComponentState(state, action) {
            state.componentState = action.payload
        },
        appendFileData: (state, action) => {
            state.fileData = [...state.fileData, ...action.payload.files];
        },
        storeFileState(state, action) {
            state.fileState = action.payload
        },
        removeFileData(state, action) {
            const file = action.payload
            state.fileData = state.fileData.filter(i => i.name != file.name)
        },
        getNextFile(state) {
            const imageFileTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
            ]
            const nextIndex = state.fileState.index + 1;
            const lastIndex = state.fileData.length - 1;

            let newIndex = nextIndex;

            if (nextIndex > lastIndex) {
                newIndex = 0;
            }
            state.fileState = {
                zoom: true,
                fileSrc: URL.createObjectURL(state.fileData[newIndex]),
                index: newIndex,
                isImage: imageFileTypes.includes(state.fileData[newIndex].type),
                fileName: state.fileData[newIndex].name,
                type: state.fileData[newIndex].type,
                size: state.fileData[newIndex].size
            };
        },
        getPrevFile(state) {
            const imageFileTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
            ]
            const prevIndex = state.fileState.index - 1;
            const lastIndex = state.fileData.length - 1;

            let newIndex = prevIndex;

            if (prevIndex < 0) {
                // to the last index if it's index 0
                newIndex = lastIndex;
            }

            state.fileState = {
                zoom: true,
                fileSrc: URL.createObjectURL(state.fileData[newIndex]),
                index: newIndex,
                isImage: imageFileTypes.includes(state.fileData[newIndex].type),
                fileName: state.fileData[newIndex].name,
                type: state.fileData[newIndex].type,
                size: state.fileData[newIndex].size
            };
        }
    }
})

export const { storeFileState, storeFileData, removeFileData, getNextFile, getPrevFile, appendFileData, setComponentState } = file.actions

export default file.reducer