# frozen-string-literal: true

require 'tree'

module DataStructures
  class Trie
    attr_reader :size

    def initialize
      @root = NaryTreeNode.new('', nil, [])
      @size = 0
    end

    def insert(word)
      return raise "Invalid word: #{word}" if word =~ /\s/

      letters = word.split('')
      current = @root
      did_insert = false
      letters.each do |letter|
        letter_position = current.children.index(current.children.find { |x| !dummy?(x) && x.value == letter })

        if !letter_position.nil?
          current = current.children[letter_position]
        else
          current.children.push(NaryTreeNode.new(letter, current, []))
          current = current.children.last
          @size += 1
          did_insert = true
        end
      end

      return false unless did_insert || current.children.find { |node| dummy?(node) }.nil?

      dummy = NaryTreeNode.new('dummy', current, [])
      dummy.node_type = 'dummy'
      current.children.push(dummy)
      true
    end

    def insert_all(elems)
      result = true
      elems.each do |elem|
        success = insert(elem)
        result &&= success
      end
      result
    end

    def validate_prefix(prefix)
      letters = prefix.split('')
      current = @root
      letters.each do |letter|
        letter_position = current.children.index(current.children.find { |x| !dummy?(x) && x.value == letter })
        return false if letter_position.nil?

        current = current.children[letter_position]
      end
      true
    end

    def validate_word(word)
      letters = word.split('')
      current = @root
      letters.each do |letter|
        letter_position = current.children.index(current.children.find { |x| !dummy?(x) && x.value == letter })
        return false if letter_position.nil?

        current = current.children[letter_position]
      end
      !current.children.find { |node| dummy?(node) }.nil?
    end

    def clear
      @root = NaryTreeNode.new('', nil, [])
      @size = 0
    end

    def empty?
      @size.zero?
    end

    private

    def dummy?(node)
      node.node_type == 'dummy'
    end
  end
end
