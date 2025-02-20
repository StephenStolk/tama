"use client"
import React, {useState} from "react";
import {Input} from "./ui/input"
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface TagPickerProps {
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagPicker: React.FC<TagPickerProps> = ({tags, setTags}) => {
    const availableTags = ["OC", "Spoiler", "Entertainment", "Business", "Technology"];
    //const [tags, setTags] = useState<string[]>([]);
    const [customTag, setCustomTag] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (): void => setIsModalOpen(true);

    const handleCloseModal = (): void => {
        setIsModalOpen(false);
        setCustomTag("");
      };

      const maxTags = 2;

      const handleAddTag = (tag: string): void => {
        if(tags.length < maxTags && !tags.includes(tag)) {
            setTags([...tags,tag]);
        }
      };

      const handleCustomTag = (): void => {
        if(customTag.trim() && !tags.includes(customTag) && tags.length < maxTags) {
            setTags([...tags, customTag.trim()]);
            setCustomTag("");
            handleCloseModal();
        }
      }

      const handleRemoveTag = (tag: string): void => {
        setTags(tags.filter((t) => t!== tag));
      }

      return (
        <>
          {/* Tag selection section */}
      <div className="flex gap-2 flex-wrap mb-4 mt-8">
        {availableTags.map((tag) => (
          <Button
            key={tag}
            variant="outline"
            size="sm"
            className="flex items-center justify-center text-center"
            onClick={() => handleAddTag(tag)}
            disabled={tags.length >= maxTags}
          >
            {tag} <span className="text-md">+</span>
          </Button>
        ))}
        <Button variant="outline" size="sm" onClick={handleOpenModal} disabled={tags.length >= maxTags}>
          + Custom
        </Button>
      </div>

      {/* Set Tags section (only visible if tags are selected) */}
      {tags.length > 0 && (
        <div className="border border-gray-300 p-4 rounded-md mt-4">
          <p className="text-sm text-gray-500 mb-2">Set Tags:</p>
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag: string) => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => handleRemoveTag(tag)}
              >
                {tag} ❌
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Modal for adding custom tags */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a Custom Tag</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            placeholder="Enter a tag"
            className="mb-4"
            disabled={tags.length >= maxTags}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
            <Button onClick={handleCustomTag} disabled={tags.length >= maxTags}>Add</Button>
          </div>
        </DialogContent>
      </Dialog>
        </>
      );
};


export default TagPicker;