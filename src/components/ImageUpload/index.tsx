'use client'
import React, {FC, useState} from "react";
import { Modal, Upload, UploadProps} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {UploadFile} from "antd/es/upload/interface";
import {RcFile} from "antd/lib/upload";

interface IProps{
    changePic:(e:any)=>void,
    maxCount?:number,
    originalList?:any[]
}
const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
const ImageUpload: FC<IProps> = ({changePic,originalList=[],maxCount=0}) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>{
        // console.log(newFileList)
        setFileList(newFileList);
        changePic(newFileList)

    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>{'上传'}</div>
        </div>
    );

    return (
        <section>
            <Upload
                listType="picture-card"
                // action="gg"
                fileList={originalList.length?originalList:fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                maxCount={maxCount || 8}
                multiple
                beforeUpload={()=>false}
            >
                {fileList && fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Modal visible={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </section>
    );
};

export default ImageUpload;

